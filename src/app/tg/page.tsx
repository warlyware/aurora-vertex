"use client";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AURORA_VERTEX_WS_URL, BASE_URL, SOL_TOKEN_ADDRESS } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { TelegramMessageList, TgMessagesForDisplay } from "@/components/telegram/TelegramMessageList";
import { TelegramChannelList } from "@/components/telegram/TelegramChannelList";
import { WsHeader } from "@/components/UI/ws-header";
import JSONPretty from "react-json-pretty";

const SENDERS = {
  'GMGN Sniper Bot': 7141128298,
};

const CHANNEL_IDS = {
  'Call Analyzer 2': -1001914959004,
  'GMGN Alerts': 6917338381,
}

export default function WebSocketComponent() {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${AURORA_VERTEX_WS_URL}`
  );
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);
  const [latencyInMs, setLatencyInMs] = useState(0);
  const [tgMessagesForDisplay, setTgMessagesForDisplay] = useState<TgMessagesForDisplay>({});
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [scrapedChannels, setScrapedChannels] = useState<any[]>([]);

  const {
    PING,
    PONG,
    TG_GET_ME,
    TG_CHAT_MESSAGE,
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

  const handlePlaySound = async () => {
    const sound = new Audio(`${BASE_URL}/sounds/level-up.wav`);
    sound.play();
  };

  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage) => {
      switch (type) {
        case TG_GET_ME:
          console.log("TG_GET_ME", payload);
          break;
        case TG_CHAT_MESSAGE:
          console.log("TG_CHAT_MESSAGE", payload);

          if (payload.chatId === SENDERS['GMGN Sniper Bot']) {
            handlePlaySound();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            handlePlaySound();
          }

          console.log("CHANNEL_IDS['Call Analyzer 2']", payload);

          const scrapedUrls = payload?.textEntities?.filter(
            (entity: any) => entity.type._ === 'textEntityTypeTextUrl'
          )

          console.log('scrapedUrls', scrapedUrls);

          const channelUrl = scrapedUrls[0]?.type?.url;

          const title = scrapedUrls[0]?.type?.url.split('/').slice(-2, -1)[0];

          const toAdd = {
            id: payload.chatId,
            title,
            url: channelUrl,
          };

          scrapedChannels.forEach((channel) => {
            if (channel.id === toAdd.id) {
              return;
            }
          });

          setScrapedChannels((prev) => {
            return [
              ...prev,
              toAdd,
            ];
          })

          setTgMessagesForDisplay((prev) => {
            const chatId = payload.chatId;
            const newMessage = {
              title: payload.chat.title,
              chat: payload.chat,
              chatId: payload.chatId,
              messageId: payload.messageId,
              text: payload.text,
              timestamp: payload.formattedTimestamp,
              rawMessage: payload,
              rawChat: payload.chat,
              sender: payload.sender,
            };

            if (!prev[chatId]) {
              return { ...prev, [chatId]: [newMessage] };
            }

            const existingMessages = prev[chatId]

            if (existingMessages.some((m) => m.messageId === newMessage.messageId)) {
              // If already there, do nothing
              return prev;
            }

            return {
              ...prev,
              [chatId]: [...existingMessages, newMessage].filter((message) =>
                message.sender?.usernames?.active_usernames?.[0] !== 'safeguard'
                && message.sender?.usernames?.active_usernames?.[0] !== 'MissRose_bot'
                && !message?.text?.includes("Due to increased spam messages and bot activity")
              ),
            };
          });
          break;
        case PONG:
          setLatencyInMs(Date.now() - payload.timestamp);
          break;
        default:
          console.log('UNKNOWN MESSAGE TYPE', type, payload);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !hasSetupKeepAlive) {
      setupKeepAlive();
    }
  }, [hasSetupKeepAlive, readyState, setupKeepAlive]);

  useEffect(() => {
    if (lastMessage !== null) {
      handleMessageData(JSON.parse(lastMessage.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  return (
    <>
      <WsHeader
        latencyInMs={latencyInMs}
        tgMessagesCount={Object.values(tgMessagesForDisplay).reduce((acc, val) => acc + val.length, 0)}
        sendMessage={sendMessage}
        handlePlaySound={handlePlaySound}
      />

      <div className="w-full mx-auto flex">
        <TelegramChannelList
          tgMessagesForDisplay={tgMessagesForDisplay}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
        />
        <TelegramMessageList
          title={selectedChatId ? tgMessagesForDisplay?.[selectedChatId]?.[0]?.chat?.title : ''}
          tgMessagesForDisplay={tgMessagesForDisplay}
          selectedChatId={selectedChatId}
        />
        <div className="absolute bottom-8 rounded right-12 h-96 w-64 bg-sky-900 border border-gray-300 overflow-y-auto p-4">
          <ul>
            {scrapedChannels
              // remove duplicates
              .filter((channel, index, self) => self.findIndex((t) => t.title === channel.title) === index)
              .map((channel) => (
                <li key={channel.id} className="text-white">
                  <a href={channel.url} key={channel.id} target="_blank" rel="noreferrer">
                    {channel.title}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
