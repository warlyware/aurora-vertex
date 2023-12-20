"use client";
import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { BASE_URL } from "@/constants";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import { useState } from "react";

export default function CreateWallet() {
  const user = useUserData();
  const [address, setAddress] = useState("");
  const handleCreateWallet = async () => {
    if (!user) return;

    const { data } = await axios.post(`${BASE_URL}/api/create-wallet`, {
      userId: user.id,
    });

    setAddress(data.publicKey);
  };
  return (
    <PageWrapper>
      <CenterContentWrapper>
        <PrimaryButton onClick={handleCreateWallet}>
          Create Wallet
        </PrimaryButton>
      </CenterContentWrapper>
    </PageWrapper>
  );
}
