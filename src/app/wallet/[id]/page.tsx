"use client";
import { CopyToClipboardButton } from "@/components/UI/buttons/copy-to-clipboard-button";
import CenterPageContentWrapper from "@/components/UI/center-page-content-wrapper";
import { Header } from "@/components/UI/header";
import { PageWrapper } from "@/components/UI/page-wrapper";
import Spinner from "@/components/UI/spinner";
import { BASE_URL } from "@/constants";
import { useAurora } from "@/hooks";
import { EnhancedWallet, Wallet } from "@/types";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@mui/material";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, use } from "react";

export default function WalletDetails(props: { params: Promise<any> }) {
  const params = use(props.params);
  const [wallet, setWallet] = useState<EnhancedWallet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userWallets } = useAurora();
  const user = useUserData();

  const { id } = params;

  const handleSetWallet = async (wallet: EnhancedWallet) => {
    const { data } = await axios.post(`${BASE_URL}/api/get-wallet-balances`, {
      address: wallet?.address,
    });

    setWallet({
      ...wallet,
      balances: data.balances,
    });

    setIsLoading(false);
  };

  const handleTestTx = async () => {
    const { data } = await axios.post(`${BASE_URL}/api/swap-coins`, {
      walletAddress: wallet?.address,
      amountToSwap: 1,
      inputTokenAddress: 'EPjFWdd5AufqSSqeM2qZ7xRegQFfTvHv3gQ1ZZi9tXz',
      outputTokenAddress: 'DezU8Bz7b2y8M2u2h6eF3FgZ8McWQFzHTP7DPBLt79AD',
    });

    console.log(data);
  };

  useEffect(() => {
    if (userWallets.length) {
      const wallet = userWallets.find((wallet) => wallet.id === id);
      if (wallet) {
        handleSetWallet(wallet);
      }
    }
  }, [id, userWallets]);

  if (isLoading) {
    return (
      <>
        {!!user?.id && <Header />}
        <PageWrapper>
          <CenterPageContentWrapper>
            <Spinner />
          </CenterPageContentWrapper>
        </PageWrapper>
      </>
    );
  }

  if (!isLoading && !wallet) {
    return (
      <>
        {!!user?.id && <Header />}
        <PageWrapper>
          <CenterPageContentWrapper>
            <div className="max-w-lg mx-auto">
              <div className="text-2xl">wallet 404</div>
            </div>
          </CenterPageContentWrapper>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      {!!user?.id && <Header />}
      <PageWrapper>
        {!!wallet?.address && (
          <>
            <div className="text-3xl mb-8 flex items-center justify-center space-x-4">
              <div>{wallet.shortAddress}</div>
              <div>
                <CopyToClipboardButton text={wallet.address} />
              </div>
            </div>
            <div className="text-xl mb-2">{wallet.balances.sol} SOL</div>
            {!!wallet.balances.splTokens.length && (
              <div className="max-w-md mx-auto w-full text-lg">
                {wallet.balances.splTokens.map((token) => (
                  <div
                    className="flex justify-between space-x-8"
                    key={token.symbol}
                  >
                    <div className="w-1/2 flex justify-end">{token.symbol}</div>
                    <div className="w-1/2 flex items-center">
                      <div className="mr-8">{token.amount}</div>
                      <Link href={`/coin/${token.mint}`}>
                        <ArrowRightCircleIcon
                          className="w-6 h-6 cursor-pointer"
                          height={24}
                          width={24}
                        />
                      </Link>
                    </div>
                  </div>
                ))}
                <Button onClick={handleTestTx}>
                  Test
                </Button>
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </>
  );
}
