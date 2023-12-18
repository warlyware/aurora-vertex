"use client";
import { nhost } from "@/client";
import { Header } from "@/components/UI/header";
import { Logo } from "@/components/UI/logo";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { BASE_URL } from "@/constants";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Portfolio {
  id: string;
  coins: any[];
  wallet: string;
  totalUsd: number;
}

export default function Wallets() {
  const user = useUserData();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  const fetchWalletPortfolios = async () => {
    const { data } = await axios.post(
      `${BASE_URL}/api/get-wallet-portfolio-from-birdeye`,
      {
        address: "DPdvWV3jZkKQgH8c93CdMghaihiPpDgEX4RVmRLDF6Tg",
      }
    );
    console.log({ data });
    setPortfolio(data);
  };

  useEffect(() => {
    fetchWalletPortfolios();
  }, []);

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
