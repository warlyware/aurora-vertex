import { EyeIcon, EyeSlashIcon, PowerIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import classNames from "classnames";
import { BotStatus } from "./bot-status";
import { getAbbreviatedAddress } from "@/utils";

type BotCardProps = {
  bot: {
    id: string;
    name: string;
    botWallet?: {
      wallet?: {
        keypair?: {
          publicKey: string;
        }
      }
    }
  };
  botStatus: any;
  botLogs: any[];
  visibleBotLogs: any[];
  onToggleVisibility: (botId: string) => void;
  onBotAction: (botId: string) => void;
};

export function BotCard({
  bot,
  botStatus,
  botLogs,
  visibleBotLogs,
  onToggleVisibility,
  onBotAction
}: BotCardProps) {
  return (
    <div className="w-full p-2 px-4 bg-sky-950 rounded-lg">
      <div className="flex flex-col">
        <div className="flex justify-between space-x-2 mb-2 items-center">
          <div className="flex">
            <div className="flex items-center">
              {botStatus?.isActive ? (
                <div className="bg-green-600 h-3 w-3 rounded-full shadow-inner" />
              ) : (
                <div className="bg-red-600 h-3 w-3 rounded-full shadow-inner" />
              )}
            </div>
            <div className="font-bold ml-2">{bot.name}</div>
          </div>
          <div className="flex space-x-2 items-center">
            <button
              className={classNames([
                "h-4 w-4",
                botLogs.some((log) => log.botId === bot.id) ? "" : "text-gray-500",
              ])}
              onClick={() => onToggleVisibility(bot.id)}
            >
              {visibleBotLogs.some((log) => log.botId === bot.id) ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeSlashIcon className="h-4 w-4" />
              )}
            </button>
            <button onClick={() => onBotAction(bot.id)}>
              <PowerIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <Link
          className="text-sm underline mb-4"
          href={`/wallet/${bot?.botWallet?.wallet?.keypair?.publicKey}`}
        >
          {getAbbreviatedAddress(bot?.botWallet?.wallet?.keypair?.publicKey)}
        </Link>
      </div>
      <BotStatus status={botStatus} />
    </div>
  );
}