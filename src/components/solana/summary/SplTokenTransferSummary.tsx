import { getSolscanAccountUrl } from "@/utils/urls";
import { getAbbreviatedAddress } from "@/utils";
import { addCommasToNumber } from "@/utils/formatting";

export const SplTokenTransferSummary = (props: {
  action: {
    txSource: string;
    txDestination: string;
    transferAmount: number;
    mint: string;
  }
}) => {
  const { action } = props;
  return (
    <div className="text-sm font-medium">
      <a href={getSolscanAccountUrl(action.txSource)} target="_blank" rel="noreferrer" className="underline">
        {getAbbreviatedAddress(action.txSource)}
      </a>
      <span> sent </span>
      {addCommasToNumber(action.transferAmount)} of {' '}
      <a href={getSolscanAccountUrl(action.mint || '')} target="_blank" rel="noreferrer" className="underline">
        {getAbbreviatedAddress(action.mint)}
      </a>
      <span> to </span>
      <a href={getSolscanAccountUrl(action.txDestination)} target="_blank" rel="noreferrer" className="underline">
        {getAbbreviatedAddress(action.txDestination)}
      </a>
    </div>
  )
}