"use client";

import { nhost } from "@/client";
import { CoinTable } from "@/components/tables/coin-table/coin-table";
import { GET_COINS } from "@/graphql/queries/get-coins";

import { gql } from "@apollo/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    async function getCoins() {
      const { data, error } = await nhost.graphql.request(GET_COINS);
      if (error) {
        console.error(error);
      }
      setCoins(data?.coins);
      console.log(data);
    }

    getCoins();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CoinTable coins={coins} />
      {JSON.stringify(coins)}
    </main>
  );
}
