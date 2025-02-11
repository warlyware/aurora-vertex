'use client'
import { getAbbreviatedAddress } from "@/utils";
import ReactJson from "@microlink/react-json-view";

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
      <div className="font-bold">
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
      {message?.data &&
        <ReactJson
          collapsed={true}
          theme="twilight"
          src={message.data}
        />
      }
      {message?.actions &&
        <div className="flex flex-col gap-y-2">
          {message.actions.map((action, i) => (
            <div key={i}>
              <div className="font-bold">{action.type}</div>
              <div>{action.description}</div>
              <ReactJson
                collapsed={true}
                theme="twilight"
                src={action.rawInfo}
              />
            </div>
          ))}
        </div>
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