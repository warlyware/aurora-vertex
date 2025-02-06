"use client";
import { Header } from "@/components/UI/header";
import { Logo } from "@/components/UI/logo";
import { useUserData } from "@nhost/nextjs";
import Link from "next/link";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";

export default function Dashboard() {
  const user = useUserData();

  return (
    <>
      {!!user?.id ? (
        <WsPageWrapper>
          <WsContentWrapper
            className="flex w-full"
          >
            <div className="flex flex-col gap-6 p-6 w-full">
              <Link href="/feed"
                className="border border-gray-200 rounded-lg p-6 hover:border-sky-500 transition-colors flex flex-col"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-sky-500">Activity Feed</h2>
                <p className="text-gray-600">View real-time feed of transaction activity monitored by the system</p>
              </Link>

              <Link href="/bots"
                className="border border-gray-200 rounded-lg p-6 hover:border-sky-500 transition-colors flex flex-col"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-sky-500">Trading Bots</h2>
                <p className="text-gray-600">Manage and monitor your automated trading bots</p>
              </Link>
            </div>
          </WsContentWrapper>
        </WsPageWrapper>
      ) : (
        <Link href="/login">
          <div className="mt-16">
            <Logo />
          </div>
        </Link>
      )}
    </>
  );
}
