import { ChatBubbleBottomCenterIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Image from "next/image";
import JSONPretty from 'react-json-pretty';

export const TelegramMessage = (
  { message }: {
    message: any;
  }
) => {
  const { sender, chat, text, timestamp, messageId } = message;

  if (!messageId) {
    return null;
  }

  return (
    <>
      {text ? (
        <div key={messageId} className={classNames([
          "p-4 rounded-lg mb-4",
          sender?.usernames ? 'bg-sky-700' : 'bg-sky-900',
        ])}>
          {sender?.usernames && (
            <div className="mb-2 flex">
              <Image
                className="rounded mr-2"
                height={20}
                width={20}
                src={`data:image/jpeg;base64,${sender?.profile_photo?.minithumbnail.data}`}
                alt=""
              />
              <span>
                {sender?.usernames?.active_usernames?.[0]}
              </span>
              {sender?.usernames?.active_usernames?.[0] !== sender?.usernames?.editable_username && (
                <span className="ml-4"> ({sender?.usernames?.editable_username})</span>
              )}
            </div>
          )}

          <JSONPretty data={message?.text} />

          <div className="flex mb-2 text-xs space-x-4 text-gray-300">
            <div className="mb-4">{timestamp}</div>
            <div className="mb-2">ID: {messageId}</div>
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
      )
        : (
          <div key={message.messageId}></div>
          // <div key={message.messageId} className="p-4 rounded-lg mb-4 bg-sky-900">
          //   <div className="text-gray-100 mb-4 flex items-center">
          //     <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          //     <div>Unsupported message type</div>
          //   </div>
          //   <div className="text-xs text-gray-300">{JSON.stringify(message?.textEntities, null, 2)}</div>

          //   <div className="flex space-x-4">
          //     <button
          //       onClick={() =>
          //         navigator.clipboard.writeText(JSON.stringify(message.rawMessage, null, 2))
          //       }
          //     >
          //       <ClipboardIcon className="h-4 w-4" />
          //     </button>
          //   </div>
          // </div>
        )}
      <ul className="pb-6">
        {message?.rawMessage?.rawMessage?.content?.text?.entities?.filter(
          (entity: any) => entity.type._ === 'textEntityTypeTextUrl'
        )
          .map((entity: any) => (
            <li key={entity.offset}>
              <a
                href={entity.type.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                {entity.type.url}
              </a>
            </li>
          ))}
        {/* <JSONPretty data={message.rawMessage?.content?.text?.entities} /> */}
      </ul >
    </>
  )
}