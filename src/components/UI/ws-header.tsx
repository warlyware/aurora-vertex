import { AURORA_VERTEX_WS_URL } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { BoltIcon, ChatBubbleBottomCenterIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const {
  PONG,
} = messageTypes;

export const WsHeader = () => {
  const { sendMessage, readyState, lastMessage } = useWebSocket(
    `${AURORA_VERTEX_WS_URL}`
  );

  const [latencyInMs, setLatencyInMs] = useState(0);
  const [pingSentTime, setPingSentTime] = useState(0);
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);
  const {
    PING,
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
    setPingSentTime(now);
  }, [sendMessage, PING]);

  const setupKeepAlive = useCallback(() => {
    pingServer();

    setInterval(() => {
      pingServer();
    }, 30000);

    setHasSetupKeepAlive(true);
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
      setupKeepAlive();
    }
  }, [hasSetupKeepAlive, readyState, setupKeepAlive]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      } catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  return (
    <div className="top-0 w-full flex justify-end items-center p-4 space-x-4 h-12 absolute">
      <div className="flex items-center space-x-4 mr-4 text-gray-400 text-xs">
        <div className="flex items-center space-x-1">
          <div>server: </div>
          <div className="flex justify-end min-w-[32px]">{latencyInMs}ms</div>
        </div>
        <button className="flex"
          onClick={pingServer}
        >
          <BoltIcon className={
            classNames([
              "h-4 w-4 mr-1",
              readyState === ReadyState.OPEN ? "text-green-600" : "text-red-700",
            ])
          } />
        </button>
      </div>
    </div>
  )
}