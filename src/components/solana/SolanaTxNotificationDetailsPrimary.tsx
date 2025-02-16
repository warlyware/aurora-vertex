import { SolanaTxNotificationType } from "@/types/helius";
import { SolanaTxNotificationSummary } from "./summary/SolanaTxNotificationSummary";
import { getAbbreviatedAddress } from "@/utils";
export const SolanaTxNotificationDetailsPrimary = (props: {
  notification: SolanaTxNotificationType
}) => {
  const { notification } = props;
  const result = notification?.payload?.tx?.params?.result;

  if (!result) {
    return null;
  }

  return (
    <div className="flex justify-between items-center">
      <div className="text-gray-200 mb-4">
        {notification?.payload?.info ? notification?.payload?.info
          .replace(/[1-9A-HJ-NP-Za-km-z]{32,44}/g, (sig: string) =>
            getAbbreviatedAddress(sig)
          )
          .split('\n')
          .map((line: string, i: number) => (
            <div key={i}>{line}</div>
          ))
          : notification?.payload?.info}
      </div>
      <SolanaTxNotificationSummary notification={notification} />
    </div>
  )
}