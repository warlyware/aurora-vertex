"use client";
import { Header } from "@/components/UI/header";
import { Logo } from "@/components/UI/logo";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { useUserData } from "@nhost/nextjs";
import { useEffect } from "react";

export default function Wallets() {
  const user = useUserData();

  useEffect(() => {}, []);

  return (
    <>
      {!!user?.id && <Header />}
      <PageWrapper>{!!user?.id ? <h1>Wallets</h1> : <Logo />}</PageWrapper>
    </>
  );
}
