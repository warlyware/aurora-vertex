import Spinner from "@/components/UI/spinner";
import { useAurora } from "@/hooks";
import { useSignOut, useUserData } from "@nhost/nextjs";
import Link from "next/link";

export const Header = () => {
  const { signOut } = useSignOut();
  const user = useUserData();
  const { activeWallet, isLoadingActiveWallet } = useAurora();

  return (
    <div className="flex p-8 px-9 mx-auto w-full justify-between items-center text-sm uppercase h-16 z-10 fixed">
      <div className="flex w-full space-x-8">
        <div className="mr-8">aurora vertex</div>
        <Link href="/dashboard">coins</Link>
        <Link href="/wallet">wallets</Link>
        <div className="flex-1"></div>
        <div className="flex">
          <div className="mr-2">active wallet:</div>
          {isLoadingActiveWallet ? <Spinner /> : activeWallet?.shortAddress}
        </div>
        {!!user?.id && (
          <button onClick={signOut} className="uppercase">
            log out
          </button>
        )}
      </div>
    </div>
  );
};
