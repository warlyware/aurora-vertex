import { AuroraMessage } from "@/types/websockets/messages";
import JSONPretty from "react-json-pretty";

export const ServerLogMessage = ({ message, index }: { message: AuroraMessage, index: number }) => {
  return (
    <div>
      {message.payload}
    </div>
  );
};