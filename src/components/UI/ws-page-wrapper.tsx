'use client'
import { useUserData } from "@nhost/nextjs";
import { WsHeader } from "./ws-header";
import { Unauthorized } from "./unauthorized";

export default function WsPageWrapper(props: { children: React.ReactNode }) {
  const user = useUserData();

  if (!user || !user.id) {
    return <Unauthorized />;
  }

  return (
    <div className="flex w-full min-h-screen">
      <WsHeader />
      {props.children}
    </div>
  )
}