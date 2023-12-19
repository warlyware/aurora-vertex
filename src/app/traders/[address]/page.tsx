"use client";
import { Header } from "@/components/UI/header";
import { Logo } from "@/components/UI/logo";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { BASE_URL } from "@/constants";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Portfolio {
  id: string;
  coins: any[];
  wallet: string;
  totalUsd: number;
}

export default function TraderDetailPage() {
  const user = useUserData();
  const params = useParams();

  const [hasFetched, setHasFetched] = useState(false);
  const [hasBeenAdded, setHasBeenAdded] = useState(false);
  const [isBeingAdded, setIsBeingAdded] = useState(false);

  const address = params.address as string;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  const fetchWalletPortfolios = useCallback(async () => {
    const { data } = await axios.post(
      `${BASE_URL}/api/get-wallet-portfolio-from-birdeye`,
      {
        address,
      }
    );
    console.log({ data });
    setPortfolio(data);
    setHasFetched(true);
  }, [address]);

  const handleAddTrader = useCallback(async () => {
    setIsBeingAdded(true);
    const { data } = await axios.post(`${BASE_URL}/api/add-trader`, {
      address,
    });

    setPortfolio(data);
    setHasBeenAdded(true);
    setIsBeingAdded(false);
  }, [address]);

  useEffect(() => {
    // if (!portfolio && !hasFetched) {
    //   fetchWalletPortfolios();
    // }

    if (!hasBeenAdded && !isBeingAdded) {
      handleAddTrader();
    }
  }, [
    address,
    fetchWalletPortfolios,
    hasBeenAdded,
    handleAddTrader,
    portfolio,
    isBeingAdded,
  ]);

  return (
    <>
      {!!user?.id && <Header />}
      <PageWrapper>
        {!!user?.id && !!portfolio ? (
          <>
            <div className="text-2xl">
              Total Value: ${Number(portfolio.totalUsd).toFixed(2)}
            </div>
            {!!portfolio.coins.length && (
              <div className="mt-8">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="space-x-4">
                      <th className="text-left">Name</th>
                      <th className="text-left">Symbol</th>
                      <th className="text-left">Balance</th>
                      <th className="text-left">Price</th>
                      <th className="text-left">Value</th>
                      <th className="text-left">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.coins.map((coin) => (
                      <tr key={coin.id}>
                        <td>{coin.name}</td>
                        <td>${coin.symbol}</td>
                        <td>{coin.uiAmount}</td>
                        <td>
                          {!!coin.priceUsd &&
                            `$${Number(coin.priceUsd).toFixed(2)}`}
                        </td>
                        <td>
                          {!!coin.valueUsd &&
                            `$${Number(coin.valueUsd).toFixed(2)}`}
                        </td>
                        <td>
                          <a
                            href={`https://birdeye.so/token/${coin.address}?chain=solana`}
                            target="_blank"
                          >
                            BE
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
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
