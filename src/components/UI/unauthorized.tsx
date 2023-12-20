import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import { Logo } from "@/components/UI/logo";
import Link from "next/link";

export const Unauthorized = () => {
  return (
    <CenterContentWrapper>
      <Link href="/login">
        <Logo />
      </Link>
    </CenterContentWrapper>
  );
};
