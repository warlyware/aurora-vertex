import { SolanaTxNotificationType } from "@/types/helius";
import { getSolscanTxUrl } from "@/utils/urls";
import { GlobeAltIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import JSONPretty from "react-json-pretty";

export const SolanaTxNotification = (props: {
  message: SolanaTxNotificationType
  index: number
}) => {
  const [showFullJson, setShowFullJson] = useState(false);

  const { message, index } = props;
  const result = message?.payload?.params?.result;

  if (!result?.signature) {
    return null;
  }

  return (
    <div key={index} className="p-2 px-4 bg-gray-950 rounded-lg flex flex-col gap-y-2">
      <div className="flex space-x-2 items-center">
        <button
          onClick={() => setShowFullJson((prev) => !prev)}
        >
          <ListBulletIcon className="h-4 w-4" />
        </button>
        <a href={getSolscanTxUrl(result.signature)} target="_blank" rel="noreferrer">
          <GlobeAltIcon className="h-4 w-4" />
        </a>
      </div>
      {showFullJson && <JSONPretty data={result} />}
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400">{result.signature}</div>
        <div className="text-xs text-gray-400">
          {message.payload && new Date(message.payload.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  )
}