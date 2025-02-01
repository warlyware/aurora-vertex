import { SolanaTxNotificationType } from "@/types/helius";
import { getAbbreviatedAddress } from "@/utils";
import { getSolscanAccountUrl } from "@/utils/urls";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

type SolanaInstructionTypes = 'Transaction' | 'Token Transfer' | 'Token Mint' | 'Token Burn' | 'Token Freeze' | 'Token Thaw' | 'Token Account' | 'Token Close Account';
type SolanaActionTypes = 'SOL Transfer';
type FormattedTxAction = {
  name?: SolanaActionTypes;
  txSource?: string;
  txDestination?: string;
  transferAmount?: number;
}


export const SolanaTxNotificationSummary = (props: {
  notification: SolanaTxNotificationType
}) => {
  const [showWarningIcon, setShowWarningIcon] = useState(false);
  const [formattedTxActions, setFormattedTxActions] = useState<FormattedTxAction[]>([]);

  const { notification } = props;
  const result = notification?.payload?.params?.result;


  useEffect(() => {
    if (!result?.transaction?.transaction?.message?.instructions) return;

    const instructions = result.transaction.transaction.message.instructions;
    const newFormattedTxActions: FormattedTxAction[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      const program = instruction.program;
      const programId = instruction.programId;
      const parsed = instruction.parsed;

      if (program === 'system' && programId === '11111111111111111111111111111111' && parsed?.type === 'transfer') {
        newFormattedTxActions.push({
          name: 'SOL Transfer',
          txSource: parsed.info.source,
          txDestination: parsed.info.destination,
          transferAmount: parsed.info.lamports / LAMPORTS_PER_SOL
        });
      }
    }

    setFormattedTxActions(newFormattedTxActions);
  }, [result]);

  return (
    <div>
      {showWarningIcon && <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />}
      <div className="flex flex-col p-4 rounded-lg bg-sky-900 bg-opacity-30">
        {formattedTxActions.map((action, index) => (
          <div key={index} className="text-sm">
            <div className="mb-4">{action.name}</div>
            {action.name === 'SOL Transfer' && !!action.txSource && !!action.txDestination && (
              <div className="text-sm">
                <a href={getSolscanAccountUrl(action.txSource)} target="_blank" rel="noreferrer" className="underline">
                  {getAbbreviatedAddress(action.txSource)}
                </a>
                <span> sent </span>
                {action.transferAmount} SOL
                <span> to </span>
                <a href={getSolscanAccountUrl(action.txDestination)} target="_blank" rel="noreferrer" className="underline">
                  {getAbbreviatedAddress(action.txDestination)}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}