'use client'
import { useAuroraWebsocket } from "@/hooks/use-aurora-websocket";
import { messageTypes } from "@/types/websockets/messages";
import { AuroraMessage } from "@/types/websockets/messages";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SolanaTxNotificationType } from "@/types/helius";
import { BotMessage } from "@/components/bots/bot-message";
import { ReadyState } from "react-use-websocket";

interface BotEventsFeedProps {
  visibleLogBotIds: string[];
  onToggleVisibility?: (botId: string) => void;  // Make it optional if not always needed
}

export const BotEventsFeed: React.FC<BotEventsFeedProps> = ({
  visibleLogBotIds,
  onToggleVisibility
}) => {
  const [botLogs, setBotLogs] = useState<any[]>([]);
  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleBotLogs, setVisibleBotLogs] = useState<any[]>([]);

  const { sendMessage, lastMessage, readyState } = useAuroraWebsocket();

  const {
    BOT_TRADE_NOTIFICATION,
    BOT_LOG_EVENT,
    BOT_STATUS_UPDATE,
  } = messageTypes;


  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage | SolanaTxNotificationType) => {

      if (type === BOT_STATUS_UPDATE) return;
      console.log('handleMessageData', type);

      switch (type) {
        case BOT_TRADE_NOTIFICATION:
          setBotLogs((prev) => [...prev, payload]);
          break;
        case BOT_LOG_EVENT:
          setBotLogs((prev) => [...prev, payload]);
          break;
        default:
          console.log("BotEventsFeed: Unhandled message type", type);
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
  }, [hasBeenInitialized, readyState]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      } catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  useEffect(() => {
    if (visibleLogBotIds.length) {
      setVisibleBotLogs(botLogs.filter((log) => visibleLogBotIds.includes(log.botId)));
    }
  }, [visibleLogBotIds, botLogs]);

  return (
    <div className="space-y-2 overflow-y-auto overflow-x-hidden -mx-2">
      {[...botLogs]
        .reverse()
        .map((message, index) => (
          <BotMessage key={index} message={message} index={index} />
        ))}
    </div>
  );
};