"use client";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { Header } from "@/components/UI/header";
import { Logo } from "@/components/UI/logo";
import { CoinTable } from "@/components/tables/coin-table/coin-table";
import { useUserData } from "@nhost/nextjs";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants";
import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import showToast from "@/utils/show-toast";

export type TokenFromJupiter = {
  pubkey: string;
  lamports: number;
  data: string[];
  owner: string;
  executable: boolean;
  rentEpoch: number;
  space: number;
  params: {
    addressLookupTableAddress: string;
    serumAsks: string;
    serumBids: string;
    serumCoinVaultAccount: string;
    serumEventQueue: string;
    serumPcVaultAccount: string;
    serumVaultSigner: string;
  };
  timestamp?: string;
};

export default function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [rawCoins, setRawCoins] = useState<TokenFromJupiter[]>([]);
  const user = useUserData();

  const fetchLatestCoins = async () => {
    const {
      data: res,
    }: { data: { data: TokenFromJupiter[] }; status: number } = await axios.get(
      `${BASE_URL}/api/get-latest-jupiter-coins`
    );

    const { data } = res;

    let rawCoins: any[] = data;

    // for (const coin of data) {
    //   const { data: coinData } = await axios.post(
    //     `${BASE_URL}/api/get-token-overview`,
    //     {
    //       address: coin?.pubkey,
    //     }
    //   );

    //   console.log({ coinData });

    //   rawCoins.push({
    //     ...coin,
    //     ...coinData,
    //   });
    // }

    console.log({ rawCoins });

    setRawCoins(rawCoins.sort((a, b) => b.mintTime - a.mintTime));

    const firstCoin = data?.[0];

    // const { data: priceData } = await axios.post(
    //   `${BASE_URL}/api/get-token-price`,
    //   {
    //     // address: firstCoin?.pubkey,
    //     address: "Hw3abW2AqtdwmJTCo8FaA9JWj5oAHP4sWyCMAZsRstZA",
    //   }
    // );

    // console.log({ coinData, priceData });

    // setCoins(coinData || []);
  };

  const handleStoreLatestInRedis = async () => {
    const { data } = await axios.post(
      `${BASE_URL}/api/update-jupiter-token-list`
    );

    showToast({
      primaryMessage: "Stored Latest in Redis",
      secondaryMessage: `Stored ${data?.count} tokens`,
    });

    console.log({ data });
  };

  const handleUpdateLatestTokensList = async () => {
    const { data } = await axios.post(
      `${BASE_URL}/api/update-latest-tokens-list`
    );

    showToast({
      primaryMessage: "Latest Tokens List Updated",
    });

    console.log({ data });
  };

  return (
    <>
      {!!user?.id && <Header />}
      <PageWrapper>
        {!!user?.id ? (
          <div className="w-full -mt-12">
            <div className="flex gap-x-2 mx-2">
              <PrimaryButton onClick={handleStoreLatestInRedis}>
                Store Latest in Redis
              </PrimaryButton>
              {/* <PrimaryButton onClick={updateTokenCacheList}>
                Update Token Cache List
              </PrimaryButton> */}
              <PrimaryButton onClick={handleUpdateLatestTokensList}>
                Update Latest Tokens List
              </PrimaryButton>
              <PrimaryButton onClick={fetchLatestCoins}>
                Fetch Latest from Redis
              </PrimaryButton>
            </div>
            {/* <CoinTable coins={coins} /> */}
          </div>
        ) : (
          <Link href="/login">
            <div className="mt-16">
              <Logo />
            </div>
          </Link>
        )}
      </PageWrapper>
    </>
  );
}
