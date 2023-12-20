"use client";
import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import { Header } from "@/components/UI/header";
import { PageWrapper } from "@/components/UI/page-wrapper";
import Spinner from "@/components/UI/spinner";
import { Unauthorized } from "@/components/UI/unauthorized";
import { useAurora } from "@/hooks";
import { useUserData } from "@nhost/nextjs";

import classNames from "classnames";

export default function CreateWallet() {
  const user = useUserData();
  const {
    userWallets,
    setActiveWallet,
    createWallet,
    isCreatingWallet,
    isLoadingActiveWallet,
    isLoadingWallets,
  } = useAurora();

  if (!user?.id) return <Unauthorized />;

  if (isLoadingWallets) {
    return (
      <CenterContentWrapper>
        <Spinner />
      </CenterContentWrapper>
    );
  }

  return (
    <>
      {user?.id && <Header />}
      <PageWrapper>
        <div className="mt-16">
          <div className="text-2xl text-center">my wallets</div>
          <div className="h-16 flex justify-center py-4">
            {isLoadingActiveWallet && <Spinner />}
          </div>
          <>
            {!!userWallets?.length && (
              <div>
                {userWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => setActiveWallet(wallet)}
                    className={classNames([
                      "flex flex-row mb-4 border  p-4 rounded-md",
                      wallet.isActiveWallet
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
            <PrimaryButton onClick={createWallet} isLoading={isCreatingWallet}>
              Create Wallet
            </PrimaryButton>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
