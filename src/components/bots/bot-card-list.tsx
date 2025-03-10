'use client'
import { BotCard } from "./bot-card";

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
    ejectWallet: {
      address: string;
    }
  }>;
  botStatus: Record<string, any>;
  botLogs: any[];
  visibleLogBotIds: string[];
  onToggleVisibility: (value: string[]) => void;
  onBotAction: (botId: string, action: 'spawn' | 'stop') => void;
}

export const BotCardList: React.FC<BotCardListProps> = ({
  bots,
  botStatus,
  botLogs,
  visibleLogBotIds,
  onToggleVisibility,
  onBotAction
}) => {
  return (
    <div className="flex gap-x-4 p-4 overflow-x-auto">
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
              onBotAction(botId, 'stop');
            } else {
              onBotAction(botId, 'spawn');
            }
          }}
        />
      ))}
    </div>
  );
};