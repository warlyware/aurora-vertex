"use client";
import { Logo } from "@/components/UI/logo";
import { useUserData } from "@nhost/nextjs";
import Link from "next/link";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import dynamic from 'next/dynamic';
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_BOTS_BY_USER_ID } from "@/graphql/queries/get-bots-by-user-id";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { useAuroraWebsocket } from "@/hooks/use-aurora-websocket";
import { BASE_URL } from "@/constants";

const { BOT_SPAWN, BOT_STOP, BOT_LOG_EVENT, BOT_STATUS_UPDATE } = messageTypes;

// Dynamic imports with ssr: false
const ServerLogsFeed = dynamic(
  () => import('@/components/UI/feeds/server-logs').then(mod => mod.ServerLogsFeed),
  { ssr: false }
);

const SolanaTxEventsFeed = dynamic(
  () => import('@/components/UI/feeds/solana-tx-events-feed').then(mod => mod.SolanaTxEventsFeed),
  { ssr: false }
);

const BotEventsFeed = dynamic(
  () => import('@/components/UI/feeds/bot-events-feed').then(mod => mod.BotEventsFeed),
  { ssr: false }
);

const BotCardList = dynamic(
  () => import('@/components/bots/bot-card-list').then(mod => mod.BotCardList),
  { ssr: false }
);

export default function Dashboard() {
  const user = useUserData();
  const { sendMessage, lastMessage } = useAuroraWebsocket();

  const [visibleLogBotIds, setVisibleLogBotIds] = useState<string[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [botLogs, setBotLogs] = useState<any[]>([]);
  const [botStatus, setBotStatus] = useState<Record<string, any>>({});

  const { loading } = useQuery(GET_BOTS_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user?.id || typeof window === 'undefined',
    onCompleted: (data) => {
      setBots(data.bots);
      setVisibleLogBotIds(data.bots.map((bot: any) => bot.id));
      setIsLoading(false);
    }
  });

  const handleMessageData = useCallback(({ type, payload }: AuroraMessage) => {
    console.log("handleMessageData", { type, payload });
    switch (type) {
      case BOT_LOG_EVENT:
        setBotLogs(prev => [...prev, payload]);
        break;
      case BOT_STATUS_UPDATE:
        setBotStatus(prev => ({
          ...prev,
          [payload.botId]: payload,
        }));
        break;
    }
  }, []);

  const spawnBot = useCallback(
    (botId: string) => {
      sendMessage(
        JSON.stringify({
          type: BOT_SPAWN,
          payload: {
            botId,
            strategy: 'DEFAULT',
          },
        })
      );
    },
    [sendMessage]
  );

  const stopBot = useCallback(
    (botId: string) => {
      sendMessage(
        JSON.stringify({
          type: BOT_STOP,
          payload: {
            botId,
          },
        })
      );
    },
    [sendMessage]
  );

  const testSound = useCallback(() => {
    const sound = new Audio(`${BASE_URL}/sounds/level-up.wav`);
    sound.play();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      try {
        if (typeof lastMessage.data === 'string') {
          handleMessageData(JSON.parse(lastMessage.data));
        } else {
          handleMessageData(lastMessage.data);
        }
      } catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  return (
    <>
      {!!user?.id && !isLoading ? (
        <WsPageWrapper>
          <WsContentWrapper className="flex flex-col w-full">
            <div className="flex w-full h-[400px] bg-gray-900 rounded-lg bg-opacity-30">
              <BotCardList
                bots={bots}
                botStatus={botStatus}
                botLogs={botLogs}
                visibleLogBotIds={visibleLogBotIds}
                onToggleVisibility={setVisibleLogBotIds}
                onBotAction={(botId: string, action: 'spawn' | 'stop') => {
                  if (action === 'spawn') {
                    spawnBot(botId);
                  } else {
                    stopBot(botId);
                  }
                }}
              />
            </div>
            <div className="flex w-full" style={{ height: 'calc(100% - 384px)' }}>
              <div className="flex flex-col w-1/3 bg-black overflow-y-auto p-4">
                <div className="text-lg gotu">Server Logs</div>
                <ServerLogsFeed />
              </div>
              <div className="flex flex-col w-1/3 bg-black p-4 border-x border-pink-900">
                <div className="text-lg gotu">Solana Tx Events</div>
                <SolanaTxEventsFeed />
              </div>
              <div className="flex flex-col w-1/3 bg-black overflow-y-auto p-4">
                <div className="gotu flex justify-between items-center">
                  <div className="text-lg">
                    Bot Activity
                  </div>
                  <button
                    className="text-xs text-gray-400 underline"
                    onClick={() => {
                      testSound();
                    }}>Test Sound</button>
                </div>

                <BotEventsFeed visibleLogBotIds={visibleLogBotIds} />
              </div>
            </div>
          </WsContentWrapper>
        </WsPageWrapper>
      ) : (
        <Link href="/login">
          <Logo />
        </Link>
      )}
    </>
  );
}
