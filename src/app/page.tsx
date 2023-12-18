"use client";

import { Logo } from "@/components/UI/logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center min-h-screen">
      <Link href="/login">
        <Logo />
      </Link>
    </div>
  );
}
