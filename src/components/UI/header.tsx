import { Logo } from "@/components/UI/logo";
import { GET_ACTIVE_WALLET } from "@/graphql/queries/get-active-wallet";
import { getAbbreviatedAddress } from "@/utils";
import { useQuery } from "@apollo/client";
import { useSignOut, useUserData } from "@nhost/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const { signOut } = useSignOut();
  const user = useUserData();

  const [activeWalletAddress, setActiveWalletAddress] = useState<string | null>(
    null
  );

  const { loading } = useQuery(GET_ACTIVE_WALLET, {
    variables: {
      userId: user?.id,
    },
    skip: !user?.id,
    onCompleted: ({ wallets }) => {
      const wallet = wallets?.[0];
      if (!wallet) return;
      console.log(wallet);
      setActiveWalletAddress(wallet.address);
    },
  });

  return (
    <div className="flex p-8 px-9 mx-auto w-full justify-between items-center text-sm uppercase h-16 z-10">
      <div className="flex w-full space-x-8">
        <div className="mr-8">aurora vertex</div>
        <Link href="/dashboard">coins</Link>
        <Link href="/wallet">wallets</Link>
        <div className="flex-1"></div>
        {/* <div className="flex">
          <div className="mr-2">active wallet:</div>
          {loading ? "loading..." : getAbbreviatedAddress(activeWalletAddress)}
        </div> */}
        {!!user?.id && (
          <button onClick={signOut} className="uppercase">
            log out
          </button>
        )}
      </div>
    </div>
  );
};
