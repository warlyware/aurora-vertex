import Spinner from "@/components/UI/spinner";
import { useAurora } from "@/hooks";
import { useSignOut, useUserData } from "@nhost/nextjs";
import Link from "next/link";

export const Header = () => {
  const { signOut } = useSignOut();
  const user = useUserData();
  const { activeWallet, isLoadingActiveWallet } = useAurora();

  return (
    <div className="flex p-4 px-9 mx-auto w-full justify-between items-center text-sm uppercase h-16 z-10 fixed">
      <div className="flex w-full space-x-8 items-center">
        <Link href="/dashboard" className="mr-8">
          f a k e
        </Link>
        <Link href="/wallet">my wallets</Link>
        <Link href="/wallet-watchlist">watched wallets</Link>
        <div className="flex-1"></div>
        <div className="flex items-center">
          {isLoadingActiveWallet ? (
            <Spinner height={20} width={20} />
          ) : (
            <Link
              className="flex space-x-4"
              href={`/wallet/${activeWallet?.id}`}
            >
              <div>{activeWallet?.shortAddress}</div>
              <div className="flex">
                <div className="mr-2">{activeWallet?.balances?.sol}</div>
                <div>sol</div>
              </div>
            </Link>
          )}
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
