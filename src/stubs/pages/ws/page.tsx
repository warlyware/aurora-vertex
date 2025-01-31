"use client";
import Spinner from "@/components/UI/spinner";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import { AURORA_VERTEX_WS_URL, BASE_URL } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { useCallback, useEffect, useState, use } from "react";
import JSONPretty from "react-json-pretty";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function CoinDetailPage(props: { params: Promise<any> }) {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${AURORA_VERTEX_WS_URL}`
  );

  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const params = use(props.params);

  const {
    PING,
    PONG,
  } = messageTypes;

  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage) => {
      switch (type) {
        case PONG:
          break;
        default:
          console.log("Unhandled message type", type);
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !hasBeenInitialized) {
      setTimeout(() => {
        setIsLoading(false);
        setHasBeenInitialized(true);
      }, 500);
    }
  }, [hasBeenInitialized, readyState]);

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
            <WsContentWrapper>
              <JSONPretty data={lastMessage} />
            </WsContentWrapper>
          </WsPageWrapper>
        )}
      </div>
    </>
  );
}
