"use client";
import dynamic from 'next/dynamic';
import Spinner from "@/components/UI/spinner";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import { GET_BOTS_BY_USER_ID } from "@/graphql/queries/get-bots-by-user-id";
import { useQuery } from "@apollo/client";
import { useUserData } from "@nhost/nextjs";
import { useState, useEffect } from "react";

// Dynamic imports with ssr: false
const BotEventsFeed = dynamic(
  () => import('@/components/UI/feeds/bot-events-feed').then(mod => mod.BotEventsFeed),
  { ssr: false }
);

const BotCardList = dynamic(
  () => import('@/components/bots/bot-card-list').then(mod => mod.BotCardList),
  { ssr: false }
);

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
  strategy: string;
  ejectWallet: {
    address: string;
  }
}

export default function Page() {
  const user = useUserData();
  const [bots, setBots] = useState<AuroraBot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleLogBotIds, setVisibleLogBotIds] = useState<string[]>([]);

  const { loading } = useQuery(GET_BOTS_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user?.id || typeof window === 'undefined',
    onCompleted: (data) => {
      setBots(data.bots);
      setVisibleLogBotIds(data.bots.map((bot: AuroraBot) => bot.id));
      setIsLoading(false);
    }
  });

  return (
    <div className="flex w-full">
      {isLoading ? <Spinner /> : (
        <WsPageWrapper>
          <WsContentWrapper className="flex w-full">
            <BotCardList
              bots={bots}
              visibleLogBotIds={visibleLogBotIds}
              onToggleVisibility={setVisibleLogBotIds}
            />
            <BotEventsFeed
              visibleLogBotIds={visibleLogBotIds}
            />
          </WsContentWrapper>
        </WsPageWrapper>
      )}
    </div>
  );
}
