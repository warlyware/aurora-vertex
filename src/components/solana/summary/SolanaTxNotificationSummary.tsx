import { SolanaTxNotificationType } from "@/types/helius";
import { getAbbreviatedAddress } from "@/utils";
import { getSolscanAccountUrl } from "@/utils/urls";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";;
import { RPC_ENDPOINT } from "@/constants";
import { SolanaTransferSummary } from "./SolTransferSummary";
import { addCommasToNumber } from "@/utils/formatting";
import classNames from "classnames";
import { SplTokenTransferSummary } from "./SplTokenTransferSummary";
import { PumpfunBuySellSummary } from "./PumpfunBuySellSummary";
import JSONPretty from "react-json-pretty";

type SolanaInstructionTypes = 'Transaction' | 'Token Transfer' | 'Token Mint' | 'Token Burn' | 'Token Freeze' | 'Token Thaw' | 'Token Account' | 'Token Close Account';
type SolanaActionTypes = 'SOL Transfer' | 'SPL Token Transfer' | 'Pumpfun Buy/Sell' | 'Pumpfun Buy' | 'Pumpfun Sell' | 'Photon Buy';

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
  rawInfo?: RawSplTokenTransfer
  mint?: string;
  isInnerInstruction?: boolean;
}

const PHOTON_PROGRAM_ID = 'BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW';
const PUMPFUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'; // for buys at least

export const SolanaTxNotificationSummary = (props: {
  notification: SolanaTxNotificationType
}) => {
  const [showWarningIcon, setShowWarningIcon] = useState(false);
  const [formattedTxActions, setFormattedTxActions] = useState<FormattedTxAction[]>([]);

  const { notification } = props;
  const result = notification?.payload?.params?.result;
  const logs = notification?.payload?.params?.result?.transaction?.meta?.logMessages;


  useEffect(() => {
    if (!result?.transaction?.transaction?.message?.instructions) return;

    const instructions = result.transaction.transaction.message.instructions;
    const newFormattedTxActions: FormattedTxAction[] = [];
    const seenInnerInstructions = new Set(); // ✅ Moved outside loop to avoid duplicates

    for (let i = 0; i < instructions.length; i++) {
      const previousInstruction = instructions[i - 1];
      const instruction = instructions[i];
      const program = instruction.program;
      const programId = instruction.programId;
      const parsed = instruction.parsed;

      switch (program) {
        case 'system':
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
            default:
              break;
          }
          break;

        case 'spl-token':
          switch (parsed?.type) {
            case 'transfer':
              const info = { ...previousInstruction.parsed?.info, ...parsed.info } as RawSplTokenTransfer;

              newFormattedTxActions.push({
                name: 'SPL Token Transfer',
                txSource: info.source,
                txDestination: info.wallet,
                transferAmount: info.amount,
                rawInfo: info,
                mint: info.mint,
              });
              break;
            default:
              break;
          }
          break;

        case '': // custom program
        default:
          switch (programId) {
            case PHOTON_PROGRAM_ID:
              newFormattedTxActions.push({
                name: 'Photon Buy',
                txSource: '',
                txDestination: '',
                transferAmount: 42,
              });
              break;
          }
      }

      const internalInstructionsCollections = result.transaction.meta?.innerInstructions;
      if (internalInstructionsCollections) {
        for (let innerIdx = 0; innerIdx < internalInstructionsCollections.length; innerIdx++) {
          const instructionCollection = internalInstructionsCollections[innerIdx];

          for (let j = 0; j < instructionCollection.instructions.length; j++) {
            const instruction = instructionCollection.instructions[j];
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

            if (programId === PUMPFUN_PROGRAM_ID) {
              console.log('Pumpfun Program Found', instruction);
              const nextInstruction = instructionCollection.instructions[j + 1];
              const feeInstruction = instructionCollection.instructions[j + 2];

              if (nextInstruction?.parsed?.type === 'transfer') {
                console.log('Pumpfun Buy/Sell Found', logs);

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
  }, [result, logs]);

  return (
    <div>
      {showWarningIcon && <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />}
      <div className={classNames(["flex flex-col rounded-lg space-y-2",])}>
        {formattedTxActions
          // put inner instructions at the bottom
          .sort((a, b) => a.isInnerInstruction ? 1 : -1)
          .map((action, index) => (
            <div key={index} className={classNames([
              'rounded p-2',
              {
                "bg-sky-700 bg-opacity-30": action.name === 'SOL Transfer',
                "bg-orange-600 bg-opacity-50 text-gray-300": action.name === 'SPL Token Transfer',
                "bg-green-600 bg-opacity-50 text-gray-300": action.name === 'Pumpfun Buy',
                "bg-pink-600 bg-opacity-50 text-gray-300": action.name === 'Pumpfun Sell',
                "ml-8": action.isInnerInstruction
              }
            ])}>
              {action.name === 'SOL Transfer' && <SolanaTransferSummary action={action} key={index} />}
              {action.name === 'SPL Token Transfer' && <SplTokenTransferSummary action={action} key={index} />}
              {(action.name === 'Pumpfun Buy' || action.name === 'Pumpfun Sell')
                && <PumpfunBuySellSummary action={action} key={index} />
              }
              {action.name !== 'SOL Transfer' && action.name !== 'SPL Token Transfer' && action.name !== 'Pumpfun Buy' && action.name !== 'Pumpfun Sell' && (
                <JSONPretty data={action} />
              )}
            </div>
          ))}
      </div>
    </div>
  )
}