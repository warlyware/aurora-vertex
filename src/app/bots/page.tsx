"use client";
import { BotMessage } from "@/components/bots/bot-message";
import { BotStatus } from "@/components/bots/bot-status";
import { SolanaTxNotification } from "@/components/solana/SolanaTxNotification";
import Spinner from "@/components/UI/spinner";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import { AURORA_VERTEX_WS_URL, BASE_URL } from "@/constants";
import { SolanaTxNotificationType } from "@/types/helius";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { EyeIcon, EyeSlashIcon, PowerIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useCallback, useEffect, useState, use, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Page(props: { params: Promise<any> }) {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${AURORA_VERTEX_WS_URL}`
  );

  const bots = useMemo(() => ['SAMWISE', 'BILBO', 'FRODO'], []);

  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const [botLogs, setBotLogs] = useState<any[]>([]);
  const [visibleBotLogs, setVisibleBotLogs] = useState<any[]>([]);
  const [visibleLogBotIds, setVisibleLogBotIds] = useState<string[]>([]);
  const [botStatus, setBotStatus] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [solanaTxNotifications, setSolanaTxNotifications] = useState<SolanaTxNotificationType[]>([]);
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);


  const {
    BOT_NOTIFICATION,
    BOT_SPAWN,
    BOT_STOP,
    BOT_STATUS,
    BOT_TRADE_NOTIFICATION,
    PING,
    SOLANA_TX_NOTIFICATION
  } = messageTypes;

  const pingServer = useCallback(() => {
    const now = Date.now();
    sendMessage(
      JSON.stringify({
        type: PING,
        payload: {
          timestamp: now,
        },
      })
    );
  }, [sendMessage, PING]);

  const setupKeepAlive = useCallback(() => {
    pingServer();

    setInterval(() => {
      pingServer();
    }, 30000);

    setHasSetupKeepAlive(true);
  }, [pingServer]);

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
        case SOLANA_TX_NOTIFICATION:
          setSolanaTxNotifications((prev) => [...prev, { type, payload } as SolanaTxNotificationType]);
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
        setVisibleLogBotIds(bots);
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
                <div className="flex">
                  <button
                    className="bg-sky-900 text-white p-2 rounded-lg w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        solanaTxNotifications
                          .map((notification) => JSON.stringify(notification))
                          .join("\n")
                      );
                    }}
                  >
                    copy intercepted txs
                  </button>
                </div>

                {bots
                  .map((botId) => (
                    <div key={botId} className="w-full p-2 px-4 bg-sky-950 rounded-lg">
                      <div className="flex justify-between space-x-2 mb-2 items-center">
                        <div className="flex">
                          {/* need to add check for ping timeout */}
                          <div className="flex items-center">{botStatus[botId]?.isActive ?
                            <div className="bg-green-600 h-3 w-3 rounded-full shadow-inner" /> :
                            <div className="bg-red-600 h-3 w-3 rounded-full shadow-inner" />
                          }</div>
                          <div className="font-bold ml-2">{botId}</div>
                        </div>
                        <div className="flex space-x-2 items-center">
                          <button
                            className={classNames([
                              "h-4 w-4",
                              botLogs.some((log) => log.botId === botId) ? "" : "text-gray-500",
                            ])}
                            onClick={
                              () => {
                                setVisibleLogBotIds((prev) => {
                                  if (prev.includes(botId)) {
                                    return prev.filter((id) => id !== botId);
                                  } else {
                                    return [...prev, botId];
                                  }
                                });
                              }
                            }
                          >
                            {
                              visibleBotLogs.some((log) => log.botId === botId) ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />
                            }
                          </button>
                          <button
                            onClick={
                              botStatus[botId]?.isActive ? stopBot(botId) : spawnBot(botId)
                            }
                          >
                            <PowerIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <BotStatus status={botStatus[botId]} />
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

              <div className="w-full p-2 px-4 overflow-auto space-y-4">
                {[...solanaTxNotifications]
                  .sort((a, b) => (b?.payload?.timestamp || 0) - (a?.payload?.timestamp || 0))
                  .map((message, index) => (
                    <SolanaTxNotification key={index} message={message} index={index} />
                  ))}
              </div>
            </WsContentWrapper>
          </WsPageWrapper>
        )}
      </div>
    </>
  );
}
