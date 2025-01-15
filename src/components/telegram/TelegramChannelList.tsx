import classNames from "classnames";
import Image from "next/image";

export const TelegramChannelList = (
  { tgMessagesForDisplay, selectedChatId, setSelectedChatId }: {
    tgMessagesForDisplay: any;
    selectedChatId: number | null;
    setSelectedChatId: (chatId: number) => void;
  }
) => {
  return (
    <div className="flex flex-col w-1/4 h-[calc(100vh-64px)]">
      <div className="w-full h-full overflow-y-auto bg-sky-600 rounded-lg bg-opacity-20 px-4 ml-4">
        <div className="flex flex-col space-y-4 h-full p-4">
          {tgMessagesForDisplay && Object.keys(tgMessagesForDisplay).map((chatId) => (
            <button
              key={chatId}
              className={classNames([
                "flex items-center space-x-4 hover:bg-sky-600 hover:bg-opacity-30 p-2 rounded-lg cursor-pointer",
                parseInt(chatId) === selectedChatId ? 'font-semibold' : 'font-light',
              ])}
              onClick={() => setSelectedChatId(parseInt(chatId))}
            >
              <Image
                className="rounded"
                height={20}
                width={20}
                src={`data:image/jpeg;base64,${tgMessagesForDisplay[parseInt(chatId)][0]?.chat?.photo?.minithumbnail.data}`}
                alt=""
              />
              <div className="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
                {tgMessagesForDisplay[parseInt(chatId)]?.[0]?.chat?.title
                  ? tgMessagesForDisplay[parseInt(chatId)][0].chat.title
                  : 'Unknown'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}