import { useAuroraWebsocket } from "@/hooks/use-aurora-websocket";
import { useSignOut } from "@nhost/nextjs";
import { AuroraMessage, messageTypes } from "@/types/websockets/messages";
import { ArrowRightOnRectangleIcon, BoltIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { useRouter } from "next/navigation";
import Link from "next/link";

const {
  PONG,
  PING
} = messageTypes;

const links = [
  {
    label: "dashboard",
    href: "/dashboard",
  },
  {
    label: "traders",
    href: "/trader",
  },

];

export const WsHeader = () => {
  const { signOut } = useSignOut();
  const { sendMessage, readyState, lastMessage } = useAuroraWebsocket();

  const [latencyInMs, setLatencyInMs] = useState(0);
  const [pingSentTime, setPingSentTime] = useState(0);
  const [hasSetupKeepAlive, setHasSetupKeepAlive] = useState(false);

  const router = useRouter();

  const handleSignOut = useCallback(() => {
    signOut();
    router.push("/");
  }, [signOut, router]);

  const pingServer = useCallback(() => {
    const now = Date.now();
    sendMessage(
      JSON.stringify({
        type: PING,
        payload: {
          timestamp: now,
        },
      })
    );
    setPingSentTime(now);
  }, [sendMessage]);

  const setupKeepAlive = useCallback(() => {
    pingServer();

    setInterval(() => {
      pingServer();
    }, 30000);

    setHasSetupKeepAlive(true);
  }, [pingServer]);

  const handleMessageData = useCallback(
    async ({ type }: AuroraMessage) => {

      switch (type) {
        case PONG:
          setLatencyInMs(Date.now() - pingSentTime);
          break;
      }
    },
    [pingSentTime]
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !hasSetupKeepAlive) {
      setupKeepAlive();
    }
  }, [hasSetupKeepAlive, readyState, setupKeepAlive]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        handleMessageData(JSON.parse(lastMessage.data));
      } catch (e) { }
    }
  }, [lastMessage, handleMessageData]);

  return (
    <div className="top-0 w-full flex justify-between items-center p-4 space-x-4 h-12 absolute bg-black gotu">
      <div className="flex items-center space-x-4 mx-4 mr-8 tracking-[4px]">
        fake
      </div>

      <div className="flex items-center space-x-4 mx-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-gray-400 text-xs uppercase tracking-widest">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4 mr-4 text-gray-400 text-xs">
        <div className="flex items-center space-x-1">
          <div>server: </div>
          <div className="flex justify-end min-w-[32px]">{latencyInMs}ms</div>
        </div>
        <button onClick={pingServer}>
          <BoltIcon className={
            classNames([
              "h-4 w-4 mr-1",
              readyState === ReadyState.OPEN ? "text-green-600" : "text-red-700",
            ])
          } />
        </button>
        <button onClick={handleSignOut}>
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}