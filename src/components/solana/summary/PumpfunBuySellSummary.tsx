import { getSolscanAccountUrl } from "@/utils/urls";
import { getAbbreviatedAddress } from "@/utils";
import { addCommasToNumber } from "@/utils/formatting";
import JSONPretty from "react-json-pretty";

export const PumpfunBuySellSummary = (props: {
  action: {
    name: string;
    transferAmount: number;
    mint: string;
  }
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