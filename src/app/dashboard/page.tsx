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
import { RawCoinTable } from "@/components/tables/raw-coin-table/raw-coin-table";

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
  const user = useUserData();

  return (
    <>
      {!!user?.id && <Header />}
      <PageWrapper>
        {!!user?.id ? (
          <div className="w-full -mt-12">
            <div className="flex gap-x-2 mx-2">
            </div>
            {/* <RawCoinTable coins={rawCoins} /> */}
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
