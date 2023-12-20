"use client";
import { nhost } from "@/client";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { Header } from "@/components/UI/header";
import { Logo } from "@/components/UI/logo";
import { CoinTable } from "@/components/tables/coin-table/coin-table";
import { BASE_URL } from "@/constants";
import { GET_COINS } from "@/graphql/queries/get-coins";
import { useQuery } from "@apollo/client";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import showToast from "@/utils/show-toast";

export default function Dashboard() {
  const [coins, setCoins] = useState([]);
  const user = useUserData();

  const { loading } = useQuery(GET_COINS, {
    onCompleted: (data) => {
      setCoins(data?.coins);
    },
  });

  useEffect(() => {
    async function getCoins() {
      const { data, error } = await nhost.graphql.request(GET_COINS);
      if (error) {
        console.error(error);
      }
      setCoins(data?.coins);
    }
    getCoins();
  }, []);

  const fetchCoinDataFromBirdEye = async () => {
    const { data } = await axios.post(`${BASE_URL}/api/update-token-list`);

    console.log(data);
  };

  useEffect(() => {
    fetchCoinDataFromBirdEye();
  }, []);

  return (
    <>
      {!!user?.id && <Header />}
      <PageWrapper>
        {!!user?.id ? (
          <div className="w-full -mt-12">
            <CoinTable coins={coins} />
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
