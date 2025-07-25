"use client";

import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import Spinner from "@/components/UI/spinner";
import { BASE_URL } from "@/constants";
import { GET_COINS_ON_JUPITER } from "@/graphql/queries/get-coins-on-jupiter";
import { findProgramFunctionCalls } from "@/utils/solana";
import { useQuery } from "@apollo/client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function Jupiter() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tokensCount, setTokensCount] = useState(0);
  const [isFetched, setIsFetched] = useState(false);

  const { loading } = useQuery(GET_COINS_ON_JUPITER, {
    onCompleted: ({ coinsOnJupiter }) => {
      setTokens(coinsOnJupiter.slice(0, 10));
      setTokensCount(coinsOnJupiter.length);
      setIsLoading(false);
    },
  });

  return (
    <>
      <CenterContentWrapper>
        {isLoading && <Spinner />}
        <div className="flex flex-wrap">
          {<>{!!tokensCount && <>{JSON.stringify(tokens, null, 2)}</>}</>}
        </div>
      </CenterContentWrapper>
    </>
  );
}
