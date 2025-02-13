
import { SolanaTxNotificationType } from "@/types/helius";
import classNames from "classnames";

export const SolanaTxNotificationSummary = (props: {
  notification: SolanaTxNotificationType
}) => {
  const { notification } = props;
  const actions = notification?.payload?.actions || [];

  return (
    <div className="flex flex-col space-y-2 rounded-lg p-4">
      {actions.map((action, index) => (
        <div key={index} className={classNames([
          "rounded p-2",
          {
            "bg-sky-700 bg-opacity-30": action.type === 'SOL_TRANSFER',
            "bg-orange-600 bg-opacity-50": action.type === 'TOKEN_TRANSFER',
            "bg-green-700 bg-opacity-80": action.type === 'PUMPFUN_BUY',
            "bg-pink-600 bg-opacity-50": action.type === 'PUMPFUN_SELL',
            "bg-sky-800": action.type === 'RAYDIUM_SWAP'
          }
        ])}>
          <div className="text-gray-200">{action.description}</div>
        </div>
      ))}
    </div>
  );
};