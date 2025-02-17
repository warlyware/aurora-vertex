"use client";

import { useState } from "react";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import { AuroraBot, BotStrategyForm } from "@/components/bots/bot-strategy-form";
import { useQuery } from "@apollo/client";
import { GET_BOT_BY_ID } from "@/graphql/queries/get-bot-by-id";
import { use } from "react";

export default function BotSettings(props: { params: Promise<any> }) {
  const params = use(props.params);
  const { id } = params;
  const [bot, setBot] = useState<AuroraBot | null>(null);

  const { data } = useQuery(GET_BOT_BY_ID, {
    variables: { botId: id },
    skip: !id || !!bot,
    onCompleted: (data) => {
      console.log(data);
      setBot(data.bots_by_pk);
    },
  });

  return (
    <WsPageWrapper>
      <WsContentWrapper className="w-full max-w-2xl mx-auto pt-16">
        {bot && <BotStrategyForm bot={bot} />}
      </WsContentWrapper>
    </WsPageWrapper>
  );
}
