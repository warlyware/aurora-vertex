import { SolanaTxNotificationType } from "@/types/helius";
import { SolanaTxNotificationSummary } from "./SolanaTxNotificationSummary";

export const SolanaTxNotificationDetailsPrimary = (props: {
  notification: SolanaTxNotificationType
}) => {
  const { notification } = props;
  const result = notification?.payload?.params?.result;

  if (!result) {
    return null;
  }

  return (
    <div className="flex justify-between items-center">
      <SolanaTxNotificationSummary notification={notification} />
    </div>
  )
}