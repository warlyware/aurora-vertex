import { AURORA_VERTEX_FRONTEND_API_KEY, AURORA_VERTEX_WS_URL } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { useUserData } from "@nhost/nextjs";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const { PONG, PING } = messageTypes;

export const useAuroraWebsocket = () => {
  const user = useUserData();

  const { sendMessage, readyState, lastMessage } = useWebSocket(
    user?.id ? `${AURORA_VERTEX_WS_URL}/?auth=${AURORA_VERTEX_FRONTEND_API_KEY}&userId=${user.id}` : null,
    { share: true },
  );

  const [latencyInMs, setLatencyInMs] = useState(0);
  const [pingSentTime, setPingSentTime] = useState(0);
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);

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
    setPingSentTime(now);
  }, [sendMessage]);

  const setupKeepAlive = useCallback(() => {
    pingServer();

    const intervalId = setInterval(() => {
      pingServer();
    }, 30000);

    setHasSetupKeepAlive(true);

    return () => clearInterval(intervalId);
  }, [pingServer]);

  const handleMessageData = useCallback(
    async ({ type }: AuroraMessage) => {

      switch (type) {
        case PONG:
          setLatencyInMs(Date.now() - pingSentTime);
          break;
      }
    },
    [pingSentTime]
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !hasSetupKeepAlive) {
      return setupKeepAlive();
    }
  }, [hasSetupKeepAlive, readyState, setupKeepAlive]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      } catch (error) {
        console.error('Error parsing message data', error);
      }
    }
  }, [lastMessage, handleMessageData]);
  return { latencyInMs, readyState, sendMessage, lastMessage };
}