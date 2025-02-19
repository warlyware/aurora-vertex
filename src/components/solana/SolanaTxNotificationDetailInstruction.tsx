import { SolanaTxNotificationType } from "@/types/helius"
import JSONPretty from "react-json-pretty";

export const SolanaTxNotificationDetailInstruction = (props: {
  instruction: SolanaTxNotificationType['payload']['tx']['params']['result']['transaction']['transaction']['message']['instructions'][0]
}) => {
  const { instruction } = props;

  return (
    <div className="p-2 px-4 border border-gray-800 rounded-lg">
      <div className="text-xs text-gray-400">
        <div className="text-xs text-gray-400">Program: {instruction.program}</div>
        <div className="text-xs text-gray-400">Program ID: {instruction.programId}</div>
        <div className="text-xs text-gray-400">Accounts: {instruction.accounts?.join(', ')}</div>
        <div className="text-xs text-gray-400">Data: {instruction.data}</div>
        <div className="text-xs text-gray-400">Parsed: <JSONPretty data={instruction.parsed} /></div>
        <div className="text-xs text-gray-400">Stack Height: {instruction.stackHeight}</div>
      </div>
    </div>
  )
} 