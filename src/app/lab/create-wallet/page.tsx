"use client";
import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { useAurora } from "@/hooks";

export default function CreateWallet() {
  const { createWallet } = useAurora();

  return (
    <PageWrapper>
      <CenterContentWrapper>
        <PrimaryButton onClick={createWallet}>Create Wallet</PrimaryButton>
      </CenterContentWrapper>
    </PageWrapper>
  );
}
