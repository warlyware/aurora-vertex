import { AURORA_VERTEX_WS_URL } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export const RugCheckAnalysis = ({ address }: { address: string }) => {
  const { sendMessage, lastMessage } = useWebSocket(`${AURORA_VERTEX_WS_URL}`);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  const { GET_RUG_CHECK_INFO } = messageTypes;

  const handleMessageData = useCallback(
    ({ type, payload }: AuroraMessage) => {
      switch (type) {
        case GET_RUG_CHECK_INFO:
          const { riskAnalysis } = payload;

        default:
          break;
      }
    },
    [GET_RUG_CHECK_INFO]
  );

  useEffect(() => {
    if (sendMessage && address && !hasFetchedData) {
      sendMessage(
        JSON.stringify({
          type: GET_RUG_CHECK_INFO,
          payload: {
            address,
          },
        })
      );
    }
    setHasFetchedData(true);
  }, [GET_RUG_CHECK_INFO, address, sendMessage, hasFetchedData]);

  useEffect(() => {
    if (lastMessage !== null) {
      handleMessageData(JSON.parse(lastMessage.data));
    }
  }, [lastMessage, GET_RUG_CHECK_INFO, handleMessageData]);

  return <div className="flex space-x-4"></div>;
};
