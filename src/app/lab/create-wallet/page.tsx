"use client";
import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { BASE_URL } from "@/constants";
import axios from "axios";
import { useState } from "react";

export default function CreateWallet() {
  const [address, setAddress] = useState("");
  const handleCreateWallet = async () => {
    const { data } = await axios.post(`${BASE_URL}/api/create-wallet`);

    console.log(data);

    setAddress(data.publicKey);
  };
  return (
    <PageWrapper>
      <CenterContentWrapper>
        <div className="flex flex-col h-full w-full min-h-screen justify-center items-center">
          <PrimaryButton onClick={handleCreateWallet}>
            Create Wallet
          </PrimaryButton>
        </div>
      </CenterContentWrapper>
    </PageWrapper>
  );
}
