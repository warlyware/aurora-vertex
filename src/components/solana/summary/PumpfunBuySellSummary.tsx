import { getSolscanAccountUrl } from "@/utils/urls";
import { FormattedTxAction } from "./SolanaTxNotificationSummary";
import { getAbbreviatedAddress } from "@/utils";
import { addCommasToNumber } from "@/utils/formatting";
import JSONPretty from "react-json-pretty";

export const PumpfunBuySellSummary = (props: {
  action: FormattedTxAction
}) => {
  const { action } = props;
  return (
    <div className="text-sm font-medium">
      <div className="font-bold">
        {action.name}
      </div>
      <div>
        {addCommasToNumber(action.transferAmount)} of {' '}
        <a href={getSolscanAccountUrl(action.mint || '')} target="_blank" rel="noreferrer" className="underline">
          {getAbbreviatedAddress(action.mint)}
        </a>
      </div>
    </div>
  )
}