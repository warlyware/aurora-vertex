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
import { ArrowUpRightIcon, BanknotesIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@apollo/client";
import { GET_BOT_BY_WALLET_ADDRESS } from "@/graphql/queries/get-bot-by-wallet-address";
import showToast from "@/utils/show-toast";
export default function WalletDetails(props: { params: Promise<any> }) {
  const params = use(props.params);
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useUserData();
  const [bot, setBot] = useState<any>(null);

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

  const { data: botData, refetch } = useQuery(GET_BOT_BY_WALLET_ADDRESS, {
    variables: { address: id },
    skip: !id,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      console.log(data);
      if (!data.bots.length) {
        return;
      }
      setBot(data.bots[0]);
    },
  });

  const handleSellAllTokens = async () => {
    console.log("sell all tokens");
    showToast({
      primaryMessage: "Selling all tokens",
    });
    const { data } = await axios.post(
      `${AURORA_VERTEX_API_URL}/sell-all-tokens`,
      {
        botId: bot?.id,
        apiKey: AURORA_VERTEX_FRONTEND_API_KEY,
        priorityFeeInLamports: 0,
      }
    );

    console.log(data);
  };

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
        <div className="text-2xl mb-2 flex items-center justify-center space-x-4">
          <div>{getAbbreviatedAddress(id)}</div>
          <CopyToClipboardButton text={id} />
          <button
            className="text-gray-500 font-bold hover:text-gray-700"
            onClick={handleSellAllTokens}
          >
            <BanknotesIcon className="w-4 h-4" />
          </button>
          <a
            className="text-gray-500 font-bold hover:text-gray-700"
            href={`https://gmgn.ai/sol/address/${id}`}
            target="_blank"
          >
            <GlobeAltIcon className="w-4 h-4" />
          </a>
        </div>
        {bot && (
          <div className="mb-4 italic">
            {bot.name}
          </div>
        )}
        <div className="text-lg mb-4">{wallet?.balances?.sol} SOL</div>
        <div className="text-lg mb-4">{wallet?.balances?.lamports} lamports</div>
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
