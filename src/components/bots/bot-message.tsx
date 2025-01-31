import { AuroraMessage } from "@/types/websockets/messages"
import JSONPretty from "react-json-pretty";

export type BotLogMessage = {
  botId?: string;
  message?: string;
  time?: number;
  price?: number;
  quantity?: number;
  info?: any;
}

export const BotMessage = (props: {
  message: BotLogMessage,
  index: number
}) => {
  const { message, index } = props;



  return (
    <div className="p-2 px-4 bg-gray-950 rounded-lg flex flex-col gap-y-2">
      <div className="font-bold">
        {message?.info ? <JSONPretty data={message.info} /> : <JSONPretty data={message} />}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400">{message.botId}</div>
        <div className="text-xs text-gray-400">
          {message.time && new Date(message.time).toLocaleString()}
        </div>
      </div>
    </div>
  )
}