import { SolanaTxNotificationType } from "@/types/helius";
import { getSolscanTxUrl } from "@/utils/urls";
import { GlobeAltIcon, InformationCircleIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { SolanaTxNotificationDetails } from "./SolanaTxNotificationDetails";
import dynamic from "next/dynamic";
import { SolanaTxNotificationDetailsExtended } from "./SolanaTxNotificationDetailsExtended";
import { getAbbreviatedAddress } from "@/utils";

const ReactJsonView = dynamic(() => import('@microlink/react-json-view'), { ssr: false });

export const SolanaTxNotification = (props: {
  message: SolanaTxNotificationType
  index: number
}) => {
  const [showFullJson, setShowFullJson] = useState(false);
  const [showExtended, setShowExtended] = useState(false);

  const { message, index } = props;
  const result = message?.payload?.params?.result;

  if (!result?.signature) {
    return null;
  }

  return (
    <div key={index} className=" bg-sky-900 rounded-lg flex flex-col gap-y-4 bg-opacity-30 p-4">
      <SolanaTxNotificationDetails message={message} showExtended={showExtended} />
      <div className="flex space-x-2 items-center">
        <button
          onClick={() => setShowFullJson((prev) => !prev)}
        >
          <ListBulletIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setShowExtended((prev) => !prev)}
        >
          <InformationCircleIcon className="h-4 w-4" />
        </button>
        <a href={getSolscanTxUrl(result.signature)} target="_blank" rel="noreferrer">
          <GlobeAltIcon className="h-4 w-4" />
        </a>
      </div>
      {showExtended &&
        <>
          <hr className="border-gray-400 my-4" />
          <SolanaTxNotificationDetailsExtended message={message} />
        </>
      }
      {showFullJson && <ReactJsonView src={result} theme="monokai" />}
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400 text-ellipsis overflow-clip">{
          getAbbreviatedAddress(result.signature, 10)
        }</div>
        <div className="text-xs text-gray-400">
          {!!message?.payload?.timestamp && message.payload && new Date(message.payload.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  )
}