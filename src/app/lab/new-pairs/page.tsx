"use client";

import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import Spinner from "@/components/UI/spinner";
import { BASE_URL } from "@/constants";
import { getAbbreviatedAddress } from "@/utils";
import { getQuoteFromJupiter } from "@/utils/jupiter";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

type PoolToken = {
  name: string;
  tvl: string;
  address: string;
  solscanLink: string;
};

export default function NewPairs() {
  const [isFetched, setIsFetched] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [poolTokens, setPoolTokens] = useState<PoolToken[]>([]);

  const scrape = useCallback(async () => {
    const { data } = await axios.post(`${BASE_URL}/api/get-new-pairs`);
    console.log(data.tokens);
    setIsFetched(true);
    setLastFetchTime(Date.now());
    setPoolTokens(data.tokens);
  }, []);

  // every 30sec refetch data
  useEffect(() => {
    scrape();
    const interval = setInterval(() => {
      scrape();
    }, 30000);
    return () => clearInterval(interval);
  }, [scrape]);

  const handleGetQuote = async (address: string) => {
    const quote = await getQuoteFromJupiter(1000000, address);
    console.log(quote);
    debugger;
  };

  return (
    <>
      {!!poolTokens.length && (
        <div>
          <div className="flex flex-col items-center justify-center mt-32">
            <div className="text-3xl">New Pairs</div>
            <div className="text-2xl">
              Last fetch: {new Date(lastFetchTime).toLocaleString()}
            </div>
          </div>
          <div>
            {poolTokens.map((pool, index) => (
              <div
                key={index}
                className="flex mb-4 justify-around"
                onClick={() => handleGetQuote(pool.address)}
              >
                <div>{pool.name}</div>
                <div>{getAbbreviatedAddress(pool.address)}</div>
                <div>{pool.tvl}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!isFetched && (
        <CenterContentWrapper>
          <Spinner />
        </CenterContentWrapper>
      )}
    </>
  );
}
