import { AURORA_VERTEX_WS_URL } from "@/constants";
import { AuroraMessage } from "@/types/websockets/messages";
import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export const TokenPrice = ({ address }: { address: string }) => {
  const { sendMessage, lastMessage } = useWebSocket(`${AURORA_VERTEX_WS_URL}`);
  const [price, setPrice] = useState(0);

  const handleMessageData = useCallback(({ type, payload }: AuroraMessage) => {
    // switch (type) {
    //   case GET_PRICE_FROM_JUPITER:
    //     const { price } = payload;
    //     setPrice(price);
    //     break;
    //   default:
    //     break;
    // }
  }, []);

  useEffect(() => {
    if (address) {
      // sendMessage(
      //   JSON.stringify({
      //     type: GET_PRICE_FROM_JUPITER,
      //     payload: {
      //       address,
      //     },
      //   })
      // );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (lastMessage !== null) {
      handleMessageData(JSON.parse(lastMessage.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  return <>{price}</>;
};
