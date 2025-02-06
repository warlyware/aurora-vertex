"use client";
import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import { useAurora } from "@/hooks";
import {
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { useUserData } from "@nhost/nextjs";

import classNames from "classnames";
import Link from "next/link";

export default function CreateWallet() {
  const user = useUserData();
  const {
    userWallets,
    setActiveWallet,
    createWallet,
    isCreatingWallet,
  } = useAurora();

  return (
    <WsPageWrapper>
      <WsContentWrapper className="flex flex-col gap-6 p-6 w-full max-w-xl mx-auto">
        <div className="text-2xl text-center mb-8">my wallets</div>

        <>
          {!!userWallets?.length && (
            <div>
              {userWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={classNames([
                    "flex items-center justify-between mb-4 border rounded-md cursor-pointer p-4",
                    wallet.isActiveWallet
                      ? "border-green-500"
                      : "border-blue-700",
                  ])}
                >
                  <div onClick={() => setActiveWallet(wallet)}>
                    {wallet.address}
                  </div>
                  <Link href={`/wallet/${wallet.id}`} className="ml-4">
                    <ArrowRightCircleIcon
                      className="w-6 h-6"
                      height={32}
                      width={32}
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>

        <div className="my-8 w-full flex justify-center">
          <PrimaryButton onClick={createWallet} isLoading={isCreatingWallet}>
            Create Wallet
          </PrimaryButton>
        </div>
      </WsContentWrapper>
    </WsPageWrapper>
  );
}
