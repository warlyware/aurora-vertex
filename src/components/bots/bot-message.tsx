'use client'
import { getAbbreviatedAddress } from "@/utils";
import ReactJson from "@microlink/react-json-view";
import classNames from "classnames";

export type BotLogMessage = {
  botId?: string;
  message?: string;
  time?: number;
  price?: number;
  quantity?: number;
  info?: any;
  data?: any;
  actions?: {
    type: string;
    description: string;
    rawInfo: any;
  }[];
}

export const BotMessage = (props: {
  message: BotLogMessage,
  index: number
}) => {
  const { message, index } = props;



  return (
    <div className="p-2 bg-sky-950 rounded-lg flex flex-col gap-y-2 bg-opacity-50">
      <div className="text-gray-200 mb-4">
        {message?.info ? message.info
          .replace(/[1-9A-HJ-NP-Za-km-z]{32,44}/g, (sig: string) =>
            getAbbreviatedAddress(sig)
          )
          .split('\n')
          .map((line: string, i: number) => (
            <div key={i}>{line}</div>
          ))
          : message.info}
      </div>
      {message?.data?.actions &&
        <div className="flex flex-col gap-y-4">
          {message.data?.actions?.map((action: any, i: number) => (
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
      }
      {message?.data &&
        <ReactJson
          collapsed={true}
          theme="twilight"
          src={message.data}
        />
      }

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400">{message.botId}</div>
        <div className="text-xs text-gray-400">
          {message.time && new Date(message.time).toLocaleString()}
        </div>
      </div>
    </div>
  )
}