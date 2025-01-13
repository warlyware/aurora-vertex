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
  { tgMessagesForDisplay, selectedChatId }: {
    tgMessagesForDisplay: any;
    selectedChatId: number | null;
  }
) => {
  return (
    <div className="flex flex-col mr-4 w-3/4 rounded-lg h-[calc(100vh-64px)] overflow-y-auto bg-sky-600 bg-opacity-20 p-4">
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