import { TelegramMessage } from "./TelegramMessage";

export type TgMessageForDisplay = {
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
  text?: string;
  textEntities?: any;
  timestamp: number;
  rawMessage: any;
  rawChat: any;
};

export type TgMessagesForDisplay = {
  [chatId: number]: TgMessageForDisplay[];
};

export const TelegramMessageList = (
  { tgMessagesForDisplay, selectedChatId, title }: {
    tgMessagesForDisplay: any;
    selectedChatId: number | null;
    title: string;
  }
) => {
  return (
    <div className="flex flex-col ml-8 mr-4 w-3/4 rounded-lg h-[calc(100vh-64px)] overflow-y-auto bg-sky-600 bg-opacity-20 p-4">
      <div className="my-4 font-bold">{title} {selectedChatId}</div>
      {!!selectedChatId && [...tgMessagesForDisplay[selectedChatId]]
        .reverse()
        .map((message) => (
          <TelegramMessage
            key={message.messageId}
            message={message}
          />
        ))}
    </div>
  )
}