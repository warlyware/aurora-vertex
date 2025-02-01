import { getSolscanAccountUrl } from "@/utils/urls";
import { FormattedTxAction } from "./SolanaTxNotificationSummary";
import { getAbbreviatedAddress } from "@/utils";
import { addCommasToNumber } from "@/utils/formatting";

export const SplTokenTransferSummary = (props: {
  action: FormattedTxAction
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