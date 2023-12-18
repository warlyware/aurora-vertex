import { Logo } from "@/components/UI/logo";
import { useSignOut, useUserData } from "@nhost/nextjs";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const { signOut } = useSignOut();
  const user = useUserData();

  const handleLogout = () => {
    console.log("logout");
  };

  return (
    <div className="flex p-8 mx-auto w-full justify-between items-center text-sm uppercase h-16 z-10">
      <div>aurora vertex</div>
      {!!user?.id && (
        <button onClick={signOut} className="uppercase">
          log out
        </button>
      )}
    </div>
  );
};
