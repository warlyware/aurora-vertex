'use client'
import { SolanaTxNotification } from "@/components/solana/SolanaTxNotification";
import { SolanaTxNotificationType } from "@/types/helius";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuroraWebsocket } from "@/hooks/use-aurora-websocket";
import { messageTypes } from "@/types/websockets/messages";
import { AuroraMessage } from "@/types/websockets/messages";
import { ReadyState } from "react-use-websocket";

export const SolanaTxEventsFeed = () => {
  const { sendMessage, lastMessage, readyState } = useAuroraWebsocket();

  const bots = useMemo(() => ['SAMWISE', 'BILBO', 'FRODO'], []);

  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [solanaTxNotifications, setSolanaTxNotifications] = useState<SolanaTxNotificationType[]>([]);

  const {
    SOLANA_TX_EVENT,
    BOT_STATUS_UPDATE,
  } = messageTypes;

  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage | SolanaTxNotificationType) => {

      if (type === BOT_STATUS_UPDATE) return;

      console.log('handleMessageData', type);
      if (type === SOLANA_TX_EVENT) {
        console.log('SOLANA_TX_EVENT received', payload?.params?.result?.signature);
      }


      switch (type) {
        case SOLANA_TX_EVENT:
          setSolanaTxNotifications((prev) => [...prev, { type, payload } as SolanaTxNotificationType]);
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
      {[...solanaTxNotifications]
        .sort((a, b) => (b?.payload?.tx?.timestamp || 0) - (a?.payload?.tx?.timestamp || 0))
        .map((message, index) => (
          <SolanaTxNotification key={index} message={message} index={index} />
        ))}
    </div>
  );
};