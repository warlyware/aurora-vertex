"use client";

import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import CenterPageContentWrapper from "@/components/UI/center-page-content-wrapper";
import { Logo } from "@/components/UI/logo";
import { PageWrapper } from "@/components/UI/page-wrapper";
import Link from "next/link";

export default function Home() {
  return (
    <PageWrapper>
      <CenterPageContentWrapper>
        <Link href="/login">
          <Logo />
        </Link>
      </CenterPageContentWrapper>
    </PageWrapper>
  );
}
