"use client";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import CenterPageContentWrapper from "@/components/UI/center-page-content-wrapper";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { AURORA_VERTEX_WS_URL, BASE_URL, SOL_TOKEN_ADDRESS } from "@/constants";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { Day, Month, Year } from "@/types/datetime";
import { RaydiumLiquidityPool } from "@/types/raydium";
import { TokenPrice } from "@/components/tokens/token-price";
import {
  LiquidityPoolTable,
  RaydiumLiquidityPoolWithMeta,
} from "@/components/tables/liquidity-pool-table";
import axios from "axios";

type TimeStampedLiquidityPool = RaydiumLiquidityPool & {
  timestamp: number;
} & RaydiumLiquidityPoolWithMeta;

export default function WebSocketComponent() {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${AURORA_VERTEX_WS_URL}`
  );
  const [allPools, setAllPools] = useState<RaydiumLiquidityPool[]>([]);
  const [freshPools, setFreshPools] = useState<TimeStampedLiquidityPool[]>([]);
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);
  const [latencyInMs, setLatencyInMs] = useState(0);

  const {
    GET_LIQUIDITY_POOLS_FROM_RAYDIUM,
    GET_LIQUIDITY_POOLS_FROM_RAYDIUM_RESPONSE,
    PING,
    PONG,
    SWAP_TOKENS,
  } = messageTypes;

  const handleSwap = ({
    outputMint,
    amount,
  }: {
    outputMint: string;
    amount: string | number;
  }) => {
    if (readyState === ReadyState.OPEN) {
      debugger;
      sendMessage(
        JSON.stringify({
          type: SWAP_TOKENS,
          payload: {
            outputMint,
            amount: typeof amount === "number" ? amount.toString() : amount,
          },
        })
      );
    }
  };

  const handleGetLiquidityPools = useCallback(() => {
    if (readyState === ReadyState.OPEN) {
      const year = new Date().getFullYear().toString() as Year;
      const month = (new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0") as Month;
      let day = new Date().getDate().toString().padStart(2, "0") as Day;

      console.log({ year, month, day });

      sendMessage(
        JSON.stringify({
          type: GET_LIQUIDITY_POOLS_FROM_RAYDIUM,
          payload: {
            year,
            month,
            day,
          },
        })
      );
    }
  }, [GET_LIQUIDITY_POOLS_FROM_RAYDIUM, readyState, sendMessage]);

  const setupKeepAlive = useCallback(() => {
    sendMessage(
      JSON.stringify({
        type: PING,
        payload: {
          timestamp: Date.now(),
        },
      })
    );

    const id = setInterval(function () {
      sendMessage(
        JSON.stringify({
          type: PING,
          payload: {
            timestamp: Date.now(),
          },
        })
      );
      handleGetLiquidityPools();
    }, 1000 * 60 * 0.5); // 30 seconds

    setHasSetupKeepAlive(true);
  }, [sendMessage, PING, handleGetLiquidityPools]);

  const handleMessageData = useCallback(
    async ({ type, payload }: AuroraMessage) => {
      switch (type) {
        case GET_LIQUIDITY_POOLS_FROM_RAYDIUM_RESPONSE:
          const receivedPools = payload.pools;

          // Identify new pools
          const newPools = allPools.length
            ? receivedPools.filter(
                (pool: RaydiumLiquidityPool) =>
                  !allPools.some((existingPool) => existingPool.id === pool.id)
              )
            : [];

          for (const pool of newPools) {
            pool.timestamp = Date.now();
            const { data } = await axios.post(
              `${BASE_URL}/api/get-token-price-info-from-dexscreener`,
              {
                address:
                  pool.baseMint === SOL_TOKEN_ADDRESS
                    ? pool.quoteMint
                    : pool.baseMint,
              }
            );
            console.log(data.tokenInfo);
            pool.meta = data.tokenInfo;
          }

          setFreshPools((prevPools) =>
            [...prevPools, ...newPools].sort(
              (a, b) => b.timestamp - a.timestamp
            )
          );

          // Update allPools with the new data
          setAllPools(receivedPools);

          break;
        case PONG:
          setLatencyInMs(Date.now() - payload.timestamp);
          break;
        default:
          break;
      }
    },
    [GET_LIQUIDITY_POOLS_FROM_RAYDIUM_RESPONSE, PONG, allPools]
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
    <PageWrapper>
      <CenterPageContentWrapper>
        <div className="text-2xl mb-8">websockets huzzah</div>
        <div className="text-xl mb-8">latency: {latencyInMs}ms</div>
        <PrimaryButton onClick={handleGetLiquidityPools} className="mb-4">
          Get pools
        </PrimaryButton>
        <PrimaryButton
          onClick={() =>
            handleSwap({
              outputMint: "J4ywFdm8H7hjwKzCaEQujhkDRfCnRviVnHMvFNDAoLNQ",
              // 0.001 SOL in lamports
              amount: 1000000,
            })
          }
        >
          Swap
        </PrimaryButton>
        {/* <LiquidityPoolList pools={freshPools} /> */}
        <LiquidityPoolTable pools={freshPools} />
        <TokenPrice address={allPools[0]?.baseMint} />
        {JSON.stringify(
          allPools.map((pool) => pool.baseMint),
          null,
          2
        )}
      </CenterPageContentWrapper>
    </PageWrapper>
  );
}
