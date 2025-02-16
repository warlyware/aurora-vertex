
import { SolanaTxNotificationType } from "@/types/helius";
import classNames from "classnames";

export const SolanaTxNotificationSummary = (props: {
  notification: SolanaTxNotificationType
}) => {
  const { notification } = props;
  const actions = notification?.payload?.actions || [];

  if (actions.every(action => action.type === 'SOL_TRANSFER' || action.type === 'TOKEN_TRANSFER')) {
    return <></>
  }

  return (
    <div className="flex flex-col space-y-2 rounded-lg p-4">
      {actions.map((action, i) => (
        <div key={i} className="flex gap-x-4">
          <div className={classNames(["font-bold text-sm mb-4", {
            "text-green-400": action.type === "PUMPFUN_BUY",
            "text-red-400": action.type === "PUMPFUN_SELL",
            "text-blue-400": action.type === "RAYDIUM_SWAP",
            "text-yellow-400": action.type === "TOKEN_TRANSFER",
            "text-purple-400": action.type === "SOL_TRANSFER"
          }])}>{action.type}</div>
          <div className="text-gray-400 italic text-sm">{action.description}</div>
        </div>
      ))}
    </div>
  );
};