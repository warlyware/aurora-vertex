import { AuroraMessage } from "@/types/websockets/messages";

export const ServerLogMessage = ({ message, index }: { message: AuroraMessage, index: number }) => {
  return (
    <div>
      {typeof message.payload === 'string'
        ? message.payload.replace(/[1-9A-HJ-NP-Za-km-z]{32,44}/g, (sig) =>
          `${sig.slice(0, 4)}...${sig.slice(-4)}`)
        : message.payload}
    </div>
  );
};