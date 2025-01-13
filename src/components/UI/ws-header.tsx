import { messageTypes } from "@/types/websockets/messages";
import { BoltIcon, ChatBubbleBottomCenterIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";

const {
  PING,
  PONG,
} = messageTypes;

export const WsHeader = ({
  sendMessage,
  latencyInMs,
  tgMessagesCount,
  handlePlaySound,
}: {
  sendMessage: (message: string) => void;
  latencyInMs: number;
  tgMessagesCount: number;
  handlePlaySound: () => void;
}) => {
  return (
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
            {tgMessagesCount}
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
  )
}