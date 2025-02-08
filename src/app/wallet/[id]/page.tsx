"use client";
import { CopyToClipboardButton } from "@/components/UI/buttons/copy-to-clipboard-button";
import CenterPageContentWrapper from "@/components/UI/center-page-content-wrapper";
import { Header } from "@/components/UI/header";
import WsContentWrapper from "@/components/UI/ws-content-wrapper";
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import { AURORA_VERTEX_API_URL, AURORA_VERTEX_FRONTEND_API_KEY, BASE_URL } from "@/constants";
import { TokenBalance } from "@/types";
import { getAbbreviatedAddress } from "@/utils";
import { addCommasToNumber } from "@/utils/formatting";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import { useEffect, useState, use, useCallback } from "react";

export default function WalletDetails(props: { params: Promise<any> }) {
  const params = use(props.params);
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useUserData();

  const { id } = params;

  useEffect(() => {
    const fetchWallet = async () => {
      const { data } = await axios.get(
        `${AURORA_VERTEX_API_URL}/get-wallet-balances?address=${id}&apiKey=${AURORA_VERTEX_FRONTEND_API_KEY}`
      );
      setWallet(data);
      setIsLoading(false);
    };

    fetchWallet();
  }, [id]);

  if (!isLoading && !wallet) {
    return (
      <>
        {!!user?.id && <Header />}
        <WsPageWrapper>
          <CenterPageContentWrapper>
            <div className="max-w-lg mx-auto">
              <div className="text-2xl">wallet 404</div>
            </div>
          </CenterPageContentWrapper>
        </WsPageWrapper>
      </>
    );
  }

  return (
    <WsPageWrapper>
      <WsContentWrapper className="flex flex-col items-center justify-center w-full">
        <div className="text-3xl mb-8 flex items-center justify-center space-x-4">
          <div>{getAbbreviatedAddress(id)}</div>

          <CopyToClipboardButton text={id} />
        </div>
        <div className="text-xl mb-4">{wallet?.balances?.sol} SOL</div>
        <div className="text-xl mb-4">{wallet?.balances?.lamports} lamports</div>
        {!!wallet?.balances?.splTokens?.length && (
          <div className="max-w-md mx-auto w-full text-lg">
            {wallet?.balances?.splTokens
              ?.filter((token: TokenBalance) => token.amount > 0)
              .map((token: TokenBalance) => (
                <div
                  className="flex justify-between space-x-8"
                  key={token.symbol}
                >
                  <div className="w-1/2 flex justify-end space-x-2">
                    <div>${token.symbol}</div>
                    <CopyToClipboardButton text={token.mint} />
                  </div>
                  <div className="w-1/2 flex items-center">
                    <div className="mr-8">{addCommasToNumber(token.amount / 10 ** token.decimals)}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </WsContentWrapper>
    </WsPageWrapper>
  );
}
