"use client";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { BASE_URL } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import type { Trader } from '@/types/index';

export default function TradersList() {
  const [ traders, setTraders ] = useState([]);

  const fetchTraders = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/api/get-traders`);
    const data = await response.json();
    setTraders(data.body.traders);
    console.log(data.body.traders);
  }, []);

  useEffect(() => {
    fetchTraders();
  }, [fetchTraders]);

  if (!traders.length) {
    return <div>Loading...</div>
  }
  return (
    <>
    <PageWrapper>
      <div>
        <h2 className="my-8 text-xl">
          Traders We Follow
        </h2>
        {
          traders.map((trader: Trader) => {
            return (
              <div 
                key={trader.id}
                className="flex space-x-4"
              >
                <h1>{trader.name}</h1>
                <a 
                  href={`https://gmgn.ai/sol/address/${trader.wallet?.id}`}
                  target="_blank"
                  className="hover:text-green-500 hover:underline"
                >
                  {trader.wallet?.id}
                </a>
              </div>
            )
          })
        }
      </div>
    </PageWrapper>
    </>
  )
}