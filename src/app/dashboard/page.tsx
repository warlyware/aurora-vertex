"use client";
import { Logo } from "@/components/UI/logo";
import { useUserData } from "@nhost/nextjs";
import Link from "next/link";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import dynamic from 'next/dynamic';
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_BOTS_BY_USER_ID } from "@/graphql/queries/get-bots-by-user-id";

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

  const [visibleLogBotIds, setVisibleLogBotIds] = useState<string[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { loading } = useQuery(GET_BOTS_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user?.id || typeof window === 'undefined',
    onCompleted: (data) => {
      setBots(data.bots);
      setVisibleLogBotIds(data.bots.map((bot: any) => bot.id));
      setIsLoading(false);
    }
  });

  return (
    <>
      {!!user?.id ? (
        <WsPageWrapper>
          <WsContentWrapper
            className="flex flex-col w-full"
          >
            <div className="flex w-full h-96 bg-gray-100 rounded-lg bg-opacity-30">
              <BotCardList
                bots={bots}
                visibleLogBotIds={visibleLogBotIds}
                onToggleVisibility={setVisibleLogBotIds}
              />
            </div>
            <div className="flex w-full h-full">
              <div className="flex flex-col w-1/3 bg-slate-500 bg-opacity-30 overflow-y-auto p-4">
                <div className="text-lg">Server Logs</div>
                <ServerLogsFeed />
              </div>
              <div className="flex flex-col w-1/3 bg-yellow-500 bg-opacity-30 p-4">
                <div className="text-lg">Solana Tx Events</div>
                <SolanaTxEventsFeed />
              </div>
              <div className="flex flex-col w-1/3 bg-green-500 bg-opacity-30 overflow-y-auto p-4">
                <div className="text-lg">Bot Activity</div>
                <BotEventsFeed visibleLogBotIds={visibleLogBotIds} />
              </div>
            </div>

          </WsContentWrapper>
        </WsPageWrapper>
      ) : (
        <Link href="/login">
          <div className="mt-16">
            <Logo />
          </div>
        </Link>
      )}
    </>
  );
}
