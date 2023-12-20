"use client";
import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import { Header } from "@/components/UI/header";
import { PageWrapper } from "@/components/UI/page-wrapper";
import Spinner from "@/components/UI/spinner";
import { BASE_URL } from "@/constants";
import { GET_ACTIVE_WALLET } from "@/graphql/queries/get-active-wallet";
import { GET_WALLETS_BY_USER_ID } from "@/graphql/queries/get-wallets-by-user-id";
import { Wallet } from "@/types";
import { useQuery } from "@apollo/client";
import { ClassNames } from "@emotion/react";
import { User, useUserData } from "@nhost/nextjs";
import axios from "axios";
import classNames from "classnames";
import { useEffect, useState } from "react";

export default function CreateWallet() {
  const user = useUserData();
  const [wallets, setWallets] = useState<Wallet[] | null>(null);
  const [activeWalletAddress, setActiveWalletAddress] = useState<string | null>(
    null
  );
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isSwitchingWallets, setIsSwitchingWallets] = useState(false);

  const { loading: isFetching, refetch } = useQuery(GET_WALLETS_BY_USER_ID, {
    variables: {
      userId: user?.id,
    },
    onCompleted: ({ wallets }: { wallets: Wallet[] }) => {
      try {
        setWallets(wallets);
      } catch (error) {
        console.log(error);
        debugger;
      }
    },
  });

  const { loading: isFetchingActiveWallet, refetch: refetchActiveWallet } =
    useQuery(GET_ACTIVE_WALLET, {
      variables: {
        userId: user?.id,
      },
      onCompleted: ({ wallets }) => {
        const wallet = wallets?.[0];
        if (!wallet) return;
        setActiveWalletAddress(wallet.address);
      },
    });

  const handleSetActiveWallet = async (wallet: Wallet) => {
    if (!user || isSwitchingWallets) return;
    setIsSwitchingWallets(true);

    const { data } = await axios.post(`${BASE_URL}/api/set-active-wallet`, {
      userId: user.id,
      address: wallet.address,
    });

    setActiveWalletAddress(wallet.address);
    refetchActiveWallet();
    setIsSwitchingWallets(false);
  };

  const handleCreateWallet = async () => {
    if (!user) return;

    setIsCreatingWallet(true);

    const { data } = await axios.post(`${BASE_URL}/api/create-wallet`, {
      userId: user.id,
    });

    setWallets((wallets) => {
      if (!wallets) return null;
      return [...wallets, data];
    });

    setIsCreatingWallet(false);
  };

  if (isFetching || isFetchingActiveWallet) {
    return (
      <CenterContentWrapper>
        <Spinner />
      </CenterContentWrapper>
    );
  }

  return (
    <>
      {user?.id && <Header />}
      <div className="mt-16">
        <div className="text-2xl text-center">my wallets</div>
        <div className="h-12 flex justify-center py-4">
          {isSwitchingWallets && <Spinner />}
        </div>
        <>
          {!!wallets?.length && (
            <div>
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleSetActiveWallet(wallet)}
                  className={classNames([
                    "flex flex-row mb-4 border  p-4 rounded-md",
                    activeWalletAddress === wallet.address
                      ? "border-green-500"
                      : "border-blue-700",
                  ])}
                >
                  <div className="mr-4">{wallet.address}</div>
                </button>
              ))}
            </div>
          )}
        </>

        <div className="my-8 w-full flex justify-center">
          <PrimaryButton
            onClick={handleCreateWallet}
            isLoading={isCreatingWallet}
          >
            Create Wallet
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
