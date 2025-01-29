"use client";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { AURORA_VERTEX_WS_URL, BASE_URL } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { useCallback, useEffect, useState, use } from "react";
import JSONPretty from "react-json-pretty";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function CoinDetailPage(props: { params: Promise<any> }) {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${AURORA_VERTEX_WS_URL}`
  );

  const params = use(props.params);
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);
  const [latencyInMs, setLatencyInMs] = useState(0);
  const [notifications, setNotifications] = useState<AuroraMessage[]>([]);

  const {
    SOLANA_ACCOUNT_NOTIFICATION,
    PING,
    PONG,
  } = messageTypes;

  const setupKeepAlive = useCallback(() => {
    setInterval(() => {
      sendMessage(
        JSON.stringify({
          type: PING,
          payload: {
            timestamp: Date.now(),
          },
        })
      );
    }, 10000);

    setHasSetupKeepAlive(true);
  }, [sendMessage, PING]);

  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage) => {
      switch (type) {
        case PONG:
          const latency = Date.now() - payload.timestamp;
          setLatencyInMs(latency);
          break;

        case SOLANA_ACCOUNT_NOTIFICATION:
          setNotifications((prev) => [...prev, { type, payload }]);
          break;
        default:
          console.log("Unhandled message type", type);
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !hasSetupKeepAlive) {
      setupKeepAlive();
    }
  }, [hasSetupKeepAlive, readyState, setupKeepAlive]);

  useEffect(() => {
    if (lastMessage !== null) {
      handleMessageData(JSON.parse(lastMessage.data));
    }
  }, [lastMessage, handleMessageData]);

  return (
    <>
      <PageWrapper>
        {latencyInMs}
        <JSONPretty data={notifications} />
      </PageWrapper>
    </>
  );
}
