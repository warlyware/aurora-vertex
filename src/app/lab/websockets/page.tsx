"use client";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AURORA_VERTEX_WS_URL, BASE_URL, SOL_TOKEN_ADDRESS } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import classNames from "classnames";
import Image from "next/image";
import { BoltIcon, ChatBubbleBottomCenterIcon, ClipboardIcon, SpeakerWaveIcon, WifiIcon } from "@heroicons/react/24/outline";

type TgMessageForDisplay = {
  sender?: any;
  chat: {
    title: string;
    type: {
      _: string;
      supergroup_id?: number;
      is_channel?: boolean;
    }
    photo?: {
      _: string;
      small: any;
      big: any;
      minithumbnail: any;
      has_animation: boolean;
      is_personal: boolean;
    }
  },
  chatId: number;
  messageId: number;
  text: string;
  timestamp: number;
  rawMessage: any;
  rawChat: any;
};

type TgMessagesForDisplay = {
  [chatId: number]: TgMessageForDisplay[];
};

const SENDERS = {
  'GMGN Sniper Bot': 7141128298,
};

export default function WebSocketComponent() {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${AURORA_VERTEX_WS_URL}`
  );
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);
  const [latencyInMs, setLatencyInMs] = useState(0);
  const [tgMessagesForDisplay, setTgMessagesForDisplay] = useState<TgMessagesForDisplay>({});
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const {
    PING,
    PONG,
    TG_GET_ME,
    TG_GET_CHATS,
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

            const existingMessages = prev[chatId];
            if (existingMessages.some((m) => m.messageId === newMessage.messageId)) {
              // If already there, do nothing
              return prev;
            }

            return {
              ...prev,
              [chatId]: [...existingMessages, newMessage],
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
      <div className="top-0 w-full flex justify-end items-center p-4 space-x-4 h-12">
        <div className="flex items-center space-x-4 mr-16 text-gray-400 text-xs">
          <button className="flex"
            onClick={() =>
              sendMessage(
                JSON.stringify({
                  type: PING,
                  payload: {
                    timestamp: Date.now(),
                  },
                })
              )
            }
          >
            <BoltIcon className="h-4 w-4 mr-1" />
            <div>
              {latencyInMs}ms
            </div>
          </button>
          <div className="flex">
            <ChatBubbleBottomCenterIcon className="h-4 w-4 mr-1" />
            <div>
              {Object.values(tgMessagesForDisplay).reduce((acc, val) => acc + val.length, 0)}
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            handlePlaySound()
          }
        >
          <SpeakerWaveIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="w-full mx-auto flex">
        <div className="flex flex-col w-1/4 h-[calc(100vh-64px)]">
          <div className="w-full rounded-lg h-full overflow-y-auto  px-4">
            <div className="flex flex-col space-y-4 bg-sky-600 rounded-lg bg-opacity-20 h-full p-4">
              {tgMessagesForDisplay && Object.keys(tgMessagesForDisplay).map((chatId) => (
                <button
                  key={chatId}
                  className={classNames([
                    "flex items-center space-x-4 hover:bg-blue-600 hover:bg-opacity-30 p-2 rounded-lg cursor-pointer",
                    parseInt(chatId) === selectedChatId ? 'font-semibold' : 'font-light',
                  ])}
                  onClick={() => setSelectedChatId(parseInt(chatId))}
                >
                  <Image
                    className="rounded"
                    height={20}
                    width={20}
                    src={`data:image/jpeg;base64,${tgMessagesForDisplay[parseInt(chatId)][0].chat.photo?.minithumbnail.data}`}
                    alt=""
                  />
                  <div className="text-sm">
                    {tgMessagesForDisplay[parseInt(chatId)][0].chat.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col mr-4 w-3/4 rounded-lg h-[calc(100vh-64px)] overflow-y-auto bg-sky-600 bg-opacity-20 p-4">
          {!!selectedChatId && [...tgMessagesForDisplay[selectedChatId]]
            .reverse()
            .map((message) => (
              <>
                {message.text && (
                  <div key={message.messageId} className={classNames([
                    "p-4 rounded-lg mb-4",
                    message?.sender?.usernames ? 'bg-sky-700' : 'bg-sky-900',
                  ])}>
                    {message?.sender?.usernames && (
                      <div className="mb-2 flex">
                        <Image
                          className="rounded mr-2"
                          height={20}
                          width={20}
                          src={`data:image/jpeg;base64,${message?.sender?.profile_photo?.minithumbnail.data}`}
                          alt=""
                        />
                        <span>
                          {message?.sender?.usernames?.active_usernames?.[0]}
                        </span>
                        {message?.sender?.usernames?.active_usernames?.[0] !== message?.sender?.usernames?.editable_username && (
                          <span className="ml-4"> ({message?.sender?.usernames?.editable_username})</span>
                        )}
                      </div>
                    )}

                    <div className="mb-4 text-gray-100">{message.text}</div>
                    <div className="flex mb-2 text-xs space-x-4 text-gray-300">
                      <div className="mb-4">{message.timestamp}</div>
                      <div className="mb-2">ID: {message.messageId}</div>
                    </div>

                    {/* <div className="text-xs mb-4">{JSON.stringify(message.rawMessage, null, 2)}</div> */}
                    {/* <div className="text-xs mb-4">{JSON.stringify(message.rawChat, null, 2)}</div> */}

                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(JSON.stringify(message.rawMessage, null, 2))
                        }
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(JSON.stringify(message.rawChat, null, 2))
                        }
                      >
                        <ChatBubbleBottomCenterIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ))}
        </div>
      </div>
    </>
  );
}
