"use client";
import { SolanaTxEventsFeed } from "@/components/UI/feeds/solana-tx-events-feed";
import Spinner from "@/components/UI/spinner";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import { useAuroraWebsocket } from "@/hooks/use-aurora-websocket";
import { SolanaTxNotificationType } from "@/types/helius";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { useCallback, useEffect, useState, use, useMemo } from "react";
import { ReadyState } from "react-use-websocket";

export default function Page(props: { params: Promise<any> }) {
  const { sendMessage, lastMessage, readyState } = useAuroraWebsocket();

  const bots = useMemo(() => ['SAMWISE', 'BILBO', 'FRODO'], []);

  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [solanaTxNotifications, setSolanaTxNotifications] = useState<SolanaTxNotificationType[]>([]);

  const {
    SOLANA_TX_EVENT
  } = messageTypes;

  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage | SolanaTxNotificationType) => {

      console.log('handleMessageData', type);
      if (type === SOLANA_TX_EVENT) {
        console.log('SOLANA_TX_EVENT received', payload?.params?.result?.signature);
      }

      switch (type) {
        case SOLANA_TX_EVENT:
          setSolanaTxNotifications((prev) => [...prev, { type, payload } as SolanaTxNotificationType]);
          break;
        default:
          console.log("Unhandled message type", type);
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !hasBeenInitialized) {
      setTimeout(() => {
        setIsLoading(false);
        setHasBeenInitialized(true);
      }, 500);
    }
  }, [hasBeenInitialized, readyState, bots]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      } catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  return (
    <>
      <div className="flex w-full">
        {isLoading ? <div className="pt-32 w-full flex justify-center">
          <Spinner />
        </div> : (
          <WsPageWrapper>
            <WsContentWrapper
              className="flex w-full"
            >
              <SolanaTxEventsFeed />
            </WsContentWrapper>
          </WsPageWrapper>
        )}
      </div>
    </>
  );
}
