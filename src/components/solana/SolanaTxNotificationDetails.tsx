import { SolanaTxNotificationType } from "@/types/helius";
import { SolanaTxNotificationDetailsExtended } from "./SolanaTxNotificationDetailsExtended";
import { useState } from "react";
import { SolanaTxNotificationDetailsPrimary } from "./SolanaTxNotificationDetailsPrimary";

export const SolanaTxNotificationDetails = (props: {
  message: SolanaTxNotificationType
  showExtended?: boolean
}) => {

  const { message, showExtended } = props;
  const result = message?.payload?.params?.result;

  if (!result) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <SolanaTxNotificationDetailsPrimary notification={message} />
    </div>
  )
}