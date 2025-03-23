'use client'
import { SolanaTxNotification } from "@/components/solana/SolanaTxNotification";
import { SolanaTxNotificationType } from "@/types/helius";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuroraWebsocket } from "@/hooks/use-aurora-websocket";
import { messageTypes } from "@/types/websockets/messages";
import { AuroraMessage } from "@/types/websockets/messages";
import { ReadyState } from "react-use-websocket";
import { ServerLogMessage } from "../logs/server-log-message";


export const ServerLogsFeed = () => {
  const { sendMessage, lastMessage, readyState } = useAuroraWebsocket();

  const bots = useMemo(() => ['SAMWISE', 'BILBO', 'FRODO'], []);

  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverLogs, setServerLogs] = useState<AuroraMessage[]>([]);

  const {
    SERVER_LOG_EVENT,
    BOT_STATUS_UPDATE,
  } = messageTypes;

  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage) => {
      console.log('ServerLogsFeed received message:', { type, payload });

      if (type === BOT_STATUS_UPDATE) return;

      switch (type) {
        case SERVER_LOG_EVENT:
          console.log('Adding server log:', payload);
          setServerLogs((prev) => [...prev, { type, payload } as AuroraMessage]);
          break;
        default:
          console.log("Unhandled message type", type);
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !hasBeenInitialized) {
      setTimeout(() => {
        setIsLoading(false);
        setHasBeenInitialized(true);
      }, 500);
    }
  }, [hasBeenInitialized, readyState, bots]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      } catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  return (
    <div className="w-full p-2 px-4 overflow-auto space-y-4">
      {[...serverLogs]
        .reverse()
        // .sort((a, b) => (b?.payload?.timestamp || 0) - (a?.payload?.timestamp || 0))
        .map((message, index) => (
          <ServerLogMessage key={index} message={message} index={index} />
        ))}
    </div>
  );
};