import { SolanaTxNotificationType } from "@/types/helius";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";;
import { SolanaTransferSummary } from "./SolTransferSummary";
import classNames from "classnames";
import { SplTokenTransferSummary } from "./SplTokenTransferSummary";
import { PumpfunBuySellSummary } from "./PumpfunBuySellSummary";
import JSONPretty from "react-json-pretty";
import { addCommasToNumber } from "@/utils/formatting";
import { getAbbreviatedAddress } from "@/utils";

type SolanaInstructionTypes = 'Transaction' | 'Token Transfer' | 'Token Mint' | 'Token Burn' | 'Token Freeze' | 'Token Thaw' | 'Token Account' | 'Token Close Account';
type SolanaActionTypes = 'SOL Transfer' | 'SPL Token Transfer' | 'Pumpfun Buy/Sell' | 'Pumpfun Buy' | 'Pumpfun Sell' | 'Photon Action' | 'Raydium Swap';

type RawSplTokenTransfer = {
  account: string;
  mint: string;
  source: string;
  systemProgram: string;
  tokenProgram: string;
  amount: number;
  authority: string;
  wallet: string; // destination wallet
  destination: string; // destination ATA (i think)
}

export type FormattedTxAction = {
  name?: SolanaActionTypes;
  txSource: string;
  txDestination: string;
  transferAmount?: number;
  rawInfo?: RawSplTokenTransfer | any;
  mint?: string;
  isInnerInstruction?: boolean;
}

const PHOTON_PROGRAM_ID = 'BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW';
const PUMPFUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'; // for buys at least
const RAYDIUM_V4_SWAP_PROGRAM_ID = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
const SPL_TOKEN_TRANSFER_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const RAYDIUM_FEE_COLLECTION_ACCOUNT = 'AVUCZyuT35YSuj4RH7fwiyPu82Djn2Hfg7y2ND2XcnZH';

export const SolanaTxNotificationSummary = (props: {
  notification: SolanaTxNotificationType
}) => {
  const [showWarningIcon, setShowWarningIcon] = useState(false);
  const [isPhotonBotAction, setIsPhotonBotAction] = useState(false);
  const [formattedTxActions, setFormattedTxActions] = useState<FormattedTxAction[]>([]);
  const [isRaydiumAction, setIsRaydiumAction] = useState(false);

  const { notification } = props;
  const result = notification?.payload?.params?.result;
  const logs = notification?.payload?.params?.result?.transaction?.meta?.logMessages;

  const handleTokenTransferInstruction = useCallback((instruction: any, previousInstruction: any, newFormattedTxActions: FormattedTxAction[]) => {
    const info = { ...(previousInstruction?.parsed?.info || {}), ...(instruction?.parsed?.info || {}) } as RawSplTokenTransfer;

    newFormattedTxActions.push({
      name: 'SPL Token Transfer',
      txSource: info.source,
      txDestination: info.wallet,
      transferAmount: info.amount,
      rawInfo: info,
      mint: info.mint,
    });
  }, []);

  const handleRaydiumSwapInstruction = useCallback((result: SolanaTxNotificationType['payload']['params']['result'], newFormattedTxActions: FormattedTxAction[]) => {
    console.log('raydium swap ix:', result);
    const innerInstructions = result.transaction.meta?.innerInstructions?.map((ix) => ix.instructions).flat();

    const accountKeys = result.transaction.transaction.message.accountKeys;

    const txOwner = accountKeys[0]?.pubkey;
    const ownerPostTokenBalances = result.transaction.meta?.postTokenBalances.filter((balance) => balance.owner === txOwner);
    const swapIxs = innerInstructions
      .filter((ix) => ix?.parsed?.type === 'transfer')
      .filter((ix) => ix?.parsed?.info?.destination !== RAYDIUM_FEE_COLLECTION_ACCOUNT);

    const getAccountDataSizeIx = innerInstructions.find((ix) => ix?.parsed?.type === 'getAccountDataSize');
    const createAccountIx = innerInstructions.find((ix) => ix?.parsed?.type === 'createAccount');

    let splMint = getAccountDataSizeIx?.parsed?.info?.mint || ownerPostTokenBalances?.[0]?.mint;
    const ata = createAccountIx?.parsed?.info?.newAccount;

    const ownerPartOfSwap = swapIxs.find((ix) => ix?.parsed?.info?.authority === txOwner);
    const otherPartOfSwap = swapIxs.find((ix) => ix?.parsed?.info?.authority !== txOwner);
    const splTokenAmount = ownerPartOfSwap?.parsed?.info?.amount;
    const lamportAmount = otherPartOfSwap?.parsed?.info?.amount / LAMPORTS_PER_SOL;


    // if (!swapIxs) return;

    setIsRaydiumAction(true);

    newFormattedTxActions.push({
      name: 'Raydium Swap',
      txSource: '',
      txDestination: '',

      rawInfo: {
        // ownerPartOfSwap,
        description: `${getAbbreviatedAddress(txOwner)} swapped ${addCommasToNumber(splTokenAmount)} ${getAbbreviatedAddress(splMint)} for ${lamportAmount} SOL`,
        ownerPostTokenBalances,

      }
    });
  }, []);


  useEffect(() => {
    if (!result?.transaction?.transaction?.message?.instructions) return;

    const instructions = result.transaction.transaction.message.instructions;
    const newFormattedTxActions: FormattedTxAction[] = [];
    const seenInnerInstructions = new Set();

    for (let i = 0; i < instructions.length; i++) {
      const previousInstruction = instructions[i - 1];
      const instruction = instructions[i];
      const programId = instruction.programId;
      const parsed = instruction.parsed;


      switch (programId) {
        case '11111111111111111111111111111111':
          if (parsed?.type === 'transfer') {
            newFormattedTxActions.push({
              name: 'SOL Transfer',
              txSource: parsed.info.source,
              txDestination: parsed.info.destination,
              transferAmount: parsed.info.lamports / LAMPORTS_PER_SOL
            });
          }
          break;

        case SPL_TOKEN_TRANSFER_PROGRAM_ID:
          if (parsed?.type === 'transfer') {
            handleTokenTransferInstruction(instruction, previousInstruction, newFormattedTxActions);
          }
          break;


        case PHOTON_PROGRAM_ID:
          setIsPhotonBotAction(true);
          newFormattedTxActions.push({
            name: 'Photon Action',
            txSource: '',
            txDestination: '',
          });
          break;

        case RAYDIUM_V4_SWAP_PROGRAM_ID:
          handleRaydiumSwapInstruction(result, newFormattedTxActions);
          break;
      }

      const internalInstructionsCollections = result.transaction.meta?.innerInstructions;
      if (internalInstructionsCollections) {
        for (let innerIdx = 0; innerIdx < internalInstructionsCollections.length; innerIdx++) {
          const instructionCollection = internalInstructionsCollections[innerIdx];

          for (let j = 0; j < instructionCollection.instructions.length; j++) {
            const instruction = instructionCollection.instructions[j];

            const previousInstruction = instructionCollection.instructions[j - 1];
            const nextInstruction = instructionCollection.instructions[j + 1];
            const programId = instruction.programId;
            const parsed = instruction.parsed;

            const source = parsed?.info?.source || 'unknown';
            const destination = parsed?.info?.destination || 'unknown';
            const amount = parsed?.info?.amount ? Number(parsed.info.amount) : 0;
            const instructionKey = `${programId}-${parsed?.type}-${source}-${destination}-${amount}`;

            if (seenInnerInstructions.has(instructionKey)) {
              continue;
            }

            seenInnerInstructions.add(instructionKey);

            switch (programId) {
              case SPL_TOKEN_TRANSFER_PROGRAM_ID:
                handleTokenTransferInstruction(instruction, previousInstruction, newFormattedTxActions);
                break;
              case PUMPFUN_PROGRAM_ID:
                const nextInstruction = instructionCollection.instructions[j + 1];
                const feeInstruction = instructionCollection.instructions[j + 2];

                if (nextInstruction?.parsed?.type === 'transfer') {

                  let name;
                  logs?.forEach(log => {
                    if (log.includes('Buy')) {
                      name = 'Pumpfun Buy';
                    } else if (log.includes('Sell')) {
                      name = 'Pumpfun Sell';
                    }
                  });

                  newFormattedTxActions.push({
                    name,
                    txSource: nextInstruction.parsed.info.source,
                    txDestination: feeInstruction?.parsed?.info.authority,
                    transferAmount: nextInstruction?.parsed?.info.amount,
                    mint: instruction?.accounts?.[2],
                    isInnerInstruction: true,
                  });
                }

                break;

              case RAYDIUM_V4_SWAP_PROGRAM_ID:
                handleRaydiumSwapInstruction(result, newFormattedTxActions);
                console.log('raydium swap inner ix:', instruction);

                newFormattedTxActions.push({
                  name: 'Raydium Swap',
                  txSource: '',
                  txDestination: '',
                  rawInfo: instruction,
                });
                break;


              default:
                break;
            }
          }
        }
      }
    }

    const dedupedActions = newFormattedTxActions.filter((action, index, self) =>
      index === self.findIndex((t) => (
        t.txSource === action.txSource &&
        t.txDestination === action.txDestination &&
        t.transferAmount === action.transferAmount
      ))
    );

    setFormattedTxActions(dedupedActions);
  }, [result, logs, handleTokenTransferInstruction, handleRaydiumSwapInstruction]);

  const isUnkownAction = (action: FormattedTxAction) => {
    return ![
      'SOL Transfer',
      'SPL Token Transfer',
      'Pumpfun Buy',
      'Pumpfun Sell',
      'Photon Action',
      'Raydium Swap'
    ].includes(action.name ?? '');
  }

  return (
    <div className={classNames(["",
      {
        "bg-pink-400 bg-opacity-20 w-full rounded-lg p-4": isPhotonBotAction,
      }
    ])}>
      {showWarningIcon && <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />}
      <div className={classNames(["flex flex-col rounded-lg space-y-2",])}>
        {formattedTxActions
          // if innerInstructions includes Photon Action then show warning icon
          // put inner instructions at the bottom
          .sort((a, b) => a.isInnerInstruction ? 1 : -1)
          .map((action, index) => (
            <div key={index} className={classNames([
              {
                "rounded p-2 bg-sky-700 bg-opacity-30": action.name === 'SOL Transfer',
                "rounded p-2 bg-orange-600 bg-opacity-50 text-gray-300": action.name === 'SPL Token Transfer' && !isPhotonBotAction,
                "rounded p-2 bg-green-700 bg-opacity-80 text-gray-100": action.name === 'Pumpfun Buy',
                "rounded p-2 bg-pink-600 bg-opacity-50 text-gray-300": action.name === 'Pumpfun Sell',
                "ml-8": action.isInnerInstruction

              }
            ])}>
              {action.name === 'SOL Transfer' && (
                <div>
                  {isPhotonBotAction && <div className="uppercase">Photon Fee</div>}
                  <SolanaTransferSummary action={action} key={index} />
                </div>
              )}
              {action.name === 'SPL Token Transfer' && !isPhotonBotAction && < SplTokenTransferSummary action={action} key={index} />}
              {(action.name === 'Pumpfun Buy' || action.name === 'Pumpfun Sell')
                && <PumpfunBuySellSummary action={action} key={index} />
              }
              {action.name === 'Raydium Swap' && (
                <div className="text-gray-400 bg-sky-800 p-2 rounded-lg">
                  <div className="text-gray-200">Raydium swap</div>
                  {action.rawInfo?.description}
                  {!!action.rawInfo?.desription?.length && (
                    <JSONPretty data={action} />
                  )}
                </div>
              )}

              {/* catchall */}
              {isUnkownAction(action) && (
                <JSONPretty data={action} />
              )}
            </div>
          ))}
      </div>
    </div>
  )
}