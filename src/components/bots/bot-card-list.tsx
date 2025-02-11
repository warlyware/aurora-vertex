'use client'
import { useCallback, useEffect, useState } from "react";
import { BotCard } from "./bot-card";
import { messageTypes } from "@/types/websockets/messages";
import { useAuroraWebsocket } from "@/hooks/use-aurora-websocket";
import { AuroraMessage } from "@/types/websockets/messages";

interface BotCardListProps {
  bots: Array<{
    id: string;
    name: string;
    botWallet: {
      wallet: {
        keypair: {
          publicKey: string;
        }
      }
    }
    buyRatio: number;
    priorityFeeInLamports: number;
    ejectWallet: {
      address: string;
    }
  }>;
  onBotStatusUpdate?: (status: Record<string, any>) => void;
  visibleLogBotIds: string[];
  onToggleVisibility: (value: string[]) => void;
}

export const BotCardList: React.FC<BotCardListProps> = ({
  bots,
  onBotStatusUpdate,
  visibleLogBotIds,
  onToggleVisibility
}) => {
  const [botStatus, setBotStatus] = useState<Record<string, any>>({});
  const [botLogs, setBotLogs] = useState<any[]>([]);
  const [visibleBotLogs, setVisibleBotLogs] = useState<any[]>([]);
  const { sendMessage, lastMessage } = useAuroraWebsocket();

  const { BOT_SPAWN, BOT_STOP, BOT_STATUS_UPDATE, BOT_TRADE_NOTIFICATION, BOT_LOG_EVENT } = messageTypes;

  const handleMessageData = useCallback(({ type, payload }: AuroraMessage) => {
    switch (type) {
      case BOT_TRADE_NOTIFICATION:
        setBotLogs(prev => [...prev, payload]);
        break;
      case BOT_LOG_EVENT:
        setBotLogs(prev => [...prev, payload]);
        break;
      case BOT_STATUS_UPDATE:
        const newStatus = {
          ...botStatus,
          [payload.botId]: payload,
        };
        setBotStatus(newStatus);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastMessage) {
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      } catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  const spawnBot = useCallback(
    (botId: string) => () =>
      sendMessage(
        JSON.stringify({
          type: BOT_SPAWN,
          payload: {
            botId,
            strategy: 'DEFAULT',
          },
        })
      ),
    [sendMessage, BOT_SPAWN]
  );

  const stopBot = useCallback(
    (botId: string) => () =>
      sendMessage(
        JSON.stringify({
          type: BOT_STOP,
          payload: {
            botId,
          },
        })
      ),
    [sendMessage, BOT_STOP]
  );

  useEffect(() => {
    setVisibleBotLogs(
      botLogs.filter((log) => visibleLogBotIds.includes(log.botId))
    );
  }, [botLogs, visibleLogBotIds]);

  return (
    <div className="flex flex-col w-[440px] gap-x-2 gap-y-4 h-screen overflow-y-auto p-4">
      {bots.map((bot) => (
        <BotCard
          key={bot.id}
          bot={bot}
          botStatus={botStatus[bot.id]}
          botLogs={botLogs.filter((log) => log.botId === bot.id)}
          visibleBotLogs={botLogs}
          onToggleVisibility={(botId: string) => {
            const newVisibleIds = visibleLogBotIds.includes(botId)
              ? visibleLogBotIds.filter(id => id !== botId)
              : [...visibleLogBotIds, botId];
            onToggleVisibility(newVisibleIds);
          }}
          onBotAction={(botId: string) => {
            if (botStatus[botId]?.isActive) {
              stopBot(botId)();
            } else {
              spawnBot(botId)();
            }
          }}
        />
      ))}
    </div>
  );
};