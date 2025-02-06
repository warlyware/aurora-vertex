"use client";
import { BotMessage } from "@/components/bots/bot-message";
import { BotStatus } from "@/components/bots/bot-status";
import Spinner from "@/components/UI/spinner";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import { GET_BOTS_BY_USER_ID } from "@/graphql/queries/get-bots-by-user-id";
import { useAuroraWebsocket } from "@/hooks/use-aurora-websocket";
import { SolanaTxNotificationType } from "@/types/helius";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { useQuery } from "@apollo/client";
import { EyeIcon, EyeSlashIcon, PowerIcon } from "@heroicons/react/24/outline";
import { useUserData } from "@nhost/nextjs";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { ReadyState } from "react-use-websocket";
import Link from "next/link";
import { getAbbreviatedAddress } from "@/utils";
type AuroraBot = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  botWallet: {
    wallet: {
      keypair: {
        publicKey: string;
      }
    }
  }
  user: {
    id: string;
  }
}

export default function Page(props: { params: Promise<any> }) {
  const { sendMessage, lastMessage, readyState } = useAuroraWebsocket();
  const user = useUserData();

  const [bots, setBots] = useState<AuroraBot[]>([]);

  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const [botLogs, setBotLogs] = useState<any[]>([]);
  const [visibleBotLogs, setVisibleBotLogs] = useState<any[]>([]);
  const [visibleLogBotIds, setVisibleLogBotIds] = useState<string[]>([]);
  const [botStatus, setBotStatus] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const { loading } = useQuery(GET_BOTS_BY_USER_ID, {
    variables: {
      userId: user?.id,
    },
    skip: !user?.id,
    onCompleted: (data) => {
      setBots(data.bots);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const {
    BOT_NOTIFICATION,
    BOT_SPAWN,
    BOT_STOP,
    BOT_STATUS,
    BOT_TRADE_NOTIFICATION,
    SOLANA_TX_NOTIFICATION
  } = messageTypes;

  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage | SolanaTxNotificationType) => {

      console.log('handleMessageData', type);
      if (type === SOLANA_TX_NOTIFICATION) {
        console.log('SOLANA_TX_NOTIFICATION received', payload?.params?.result?.signature);
      }

      switch (type) {
        case BOT_NOTIFICATION:
          setBotLogs((prev) => [...prev, payload]);
          break;
        case BOT_TRADE_NOTIFICATION:
          setBotLogs((prev) => [...prev, payload]);
          break;
        case BOT_STATUS:
          setBotStatus(
            (prev: any) => ({
              ...prev,
              [payload.botId]: payload,
            })
          );
          break;
        default:
          console.log("Unhandled message type", type);
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const spawnBot = useCallback(
    (botId: string) => () =>
      sendMessage(
        JSON.stringify({
          type: BOT_SPAWN,
          payload: {
            botId,
            strategy: 'default',
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
    if (readyState === ReadyState.OPEN && !hasBeenInitialized) {
      setTimeout(() => {
        setIsLoading(false);
        setVisibleLogBotIds(bots.map((bot) => bot.id));
        setHasBeenInitialized(true);
      }, 500);
    }
  }, [hasBeenInitialized, readyState, botLogs, bots, visibleLogBotIds]);

  useEffect(() => {
    setVisibleBotLogs(
      botLogs.filter((log) => visibleLogBotIds.includes(log.botId))
    );
  }, [botLogs, visibleLogBotIds]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      } catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  return (
    <>
      <div className="flex w-full">
        {isLoading ? <div className="pt-32 w-full flex justify-center">
          <Spinner />
        </div> : (
          <WsPageWrapper>
            <WsContentWrapper
              className="flex w-full"
            >
              <div
                className="flex flex-col w-[440px] gap-x-2 gap-y-4 h-screen overflow-y-auto p-4"
              >
                {bots
                  .map((bot) => (
                    <div key={bot.id} className="w-full p-2 px-4 bg-sky-950 rounded-lg">
                      <div className="flex flex-col">

                        <div className="flex justify-between space-x-2 mb-2 items-center">
                          <div className="flex">
                            {/* need to add check for ping timeout */}
                            <div className="flex items-center">{botStatus[bot.id]?.isActive ?
                              <div className="bg-green-600 h-3 w-3 rounded-full shadow-inner" /> :
                              <div className="bg-red-600 h-3 w-3 rounded-full shadow-inner" />
                            }</div>
                            <div className="font-bold ml-2">{bot.name}</div>
                          </div>
                          <div className="flex space-x-2 items-center">
                            <button
                              className={classNames([
                                "h-4 w-4",
                                botLogs.some((log) => log.botId === bot.id) ? "" : "text-gray-500",
                              ])}
                              onClick={
                                () => {
                                  setVisibleLogBotIds((prev) => {
                                    if (prev.includes(bot.id)) {
                                      return prev.filter((id) => id !== bot.id);
                                    } else {
                                      return [...prev, bot.id];
                                    }
                                  });
                                }
                              }
                            >
                              {
                                visibleBotLogs
                                  .some((log) => log.botId === bot.id)
                                  ? <EyeIcon className="h-4 w-4" />
                                  : <EyeSlashIcon className="h-4 w-4" />
                              }
                            </button>
                            <button
                              onClick={
                                botStatus[bot.id]?.isActive ? stopBot(bot.id) : spawnBot(bot.id)
                              }
                            >
                              <PowerIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <Link className="text-sm underline mb-4"
                          href={`/wallet/${bot?.botWallet?.wallet?.keypair?.publicKey}`}>
                          {getAbbreviatedAddress(bot?.botWallet?.wallet?.keypair?.publicKey)}
                        </Link>
                      </div>
                      <BotStatus status={botStatus[bot.id]} />
                    </div>
                  ))}
              </div>
              {!!visibleBotLogs.length && (
                <div className="space-y-2 w-[600px] overflow-y-auto">
                  {[...visibleBotLogs]
                    .reverse()
                    .map((message, index) => (
                      <BotMessage key={index} message={message} index={index} />
                    ))}
                </div>
              )}
            </WsContentWrapper>
          </WsPageWrapper>
        )}
      </div>
    </>
  );
}
