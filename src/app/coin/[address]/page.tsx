"use client";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { AURORA_VERTEX_WS_URL, BASE_URL } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { useCallback, useEffect, useState, use } from "react";
import JSONPretty from "react-json-pretty";
import useWebSocket, { ReadyState } from "react-use-websocket";

type CoinInfo = any;

export default function CoinDetailPage(props: { params: Promise<any> }) {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${AURORA_VERTEX_WS_URL}`
  );

  const params = use(props.params);
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);
  const [latencyInMs, setLatencyInMs] = useState(0);
  const [coin, setCoin] = useState<CoinInfo | null>(null);

  const {
    GET_COIN_INFO,
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
        case GET_COIN_INFO:
          console.log("Received coin info", payload);
          setCoin(payload);
          break;
        case PONG:
          const latency = Date.now() - payload.timestamp;
          setLatencyInMs(latency);
          break;
        default:
          console.log("Unhandled message type", type);
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const requestCoinInfo = useCallback(async () => {
    sendMessage(
      JSON.stringify({
        type: GET_COIN_INFO,
        payload: {
          address: params.address,
        },
      })
    )

  }, [params?.address, sendMessage, GET_COIN_INFO]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !hasSetupKeepAlive) {
      setupKeepAlive();
    }
  }, [hasSetupKeepAlive, readyState, setupKeepAlive]);

  useEffect(() => {
    if (lastMessage?.data) {
      console.log("Received message", lastMessage);
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      }
      catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  useEffect(() => {
    if (params?.address && readyState === ReadyState.OPEN && !coin) {
      requestCoinInfo();
    }
  }, [params?.address, readyState, requestCoinInfo, coin]);

  return (
    <>
      <PageWrapper>
        latency: {latencyInMs}ms
        <JSONPretty data={coin} />
      </PageWrapper>
    </>
  );
}
