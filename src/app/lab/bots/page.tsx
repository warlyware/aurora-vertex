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
  const [botMessages, setBotMessages] = useState<any[]>([]);
  const [botStatus, setBotStatus] = useState<any>({});

  const {
    PING,
    BOT_SPAWN,
    BOT_STOP,
    BOT_STATUS_UPDATE
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
      console.log("Received message", type, payload);
      switch (type) {
        case BOT_STATUS_UPDATE:
          console.log("Received bot status", payload);
          setBotStatus(
            (prev: any) => ({
              ...prev,
              [payload.botId]: payload.status,
            })
          );
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
            strategy: 'DEFAULT',
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
    <>
      <PageWrapper>
        <div className="flex space-x-2">
          <div className="flex flex-col space-x-4 p-2 px-4 bg-sky-950 rounded-lg">
            <div className="flex space-x-2">
              <div className="font-bold">HAMBURG</div>
              <button
                onClick={spawnBot("HAMBURG")}
              >
                start
              </button>
              <button
                onClick={stopBot("HAMBURG")}
              >
                stop
              </button>
            </div>
            <JSONPretty data={botStatus['HAMBURG']} />
          </div>
          <div className="flex flex-col space-x-4 p-2 px-4 bg-yellow-950 rounded-lg">
            <div className="flex space-x-2">
              <div className="font-bold">BILBO</div>
              <button
                onClick={spawnBot("BILBO")}
              >
                start
              </button>
              <button
                onClick={stopBot("BILBO")}
              >
                stop
              </button>
            </div>
          </div>
          <div className="flex flex-col space-x-4 p-2 px-4 bg-green-950 rounded-lg">
            <div className="flex space-x-2">
              <div className="font-bold">BERTRAND</div>
              <button
                onClick={spawnBot("BERTRAND")}
              >
                start
              </button>
              <button
                onClick={stopBot("BERTRAND")}
              >
                stop
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {botMessages.map(({ message }, index) => (
            <div key={index} className="p-2 px-4 bg-gray-950 rounded-lg">
              {message}
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
