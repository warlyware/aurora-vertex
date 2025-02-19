import { getAbbreviatedAddress } from "@/utils"
import { getSolscanAccountUrl } from "@/utils/urls"

export const SolanaTransferSummary = (props: {
  action: {
    txSource: string;
    txDestination: string;
    transferAmount: number;
  }
}) => {
  const { action } = props;
  return (
    <>{!!action.txSource && !!action.txDestination && (
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
    )}</>
  )
}