"use client";
import { GetTokenInfoFromDasResponse } from "@/app/api/get-token-info-from-das/route";
import { GetTokenInfoFromDexscreenerResponse } from "@/app/api/get-token-info-from-dexscreener/route";
import { GetTokenInfoFromHeliusResponse } from "@/app/api/get-token-info-from-helius/route";
import { CopyToClipboardButton } from "@/components/UI/buttons/copy-to-clipboard-button";
import CenterPageContentWrapper from "@/components/UI/center-page-content-wrapper";
import { Header } from "@/components/UI/header";
import { PageWrapper } from "@/components/UI/page-wrapper";
import Spinner from "@/components/UI/spinner";
import { TokenLinks } from "@/components/tokens/token-links";
import { BASE_URL } from "@/constants";
import { HolderFromSolscan } from "@/types/solscan";
import { getAbbreviatedAddress } from "@/utils";
import { addCommasToNumber, truncateDescription } from "@/utils/formatting";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type CoinInfo = GetTokenInfoFromDasResponse &
  GetTokenInfoFromHeliusResponse &
  GetTokenInfoFromDexscreenerResponse & {
    holders: HolderFromSolscan[];
    holderCount: number;
  };

export default function CoinDetailPage({ params }: { params: any }) {
  const user = useUserData();
  const { address } = params;
  const [coin, setCoin] = useState<CoinInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoin = useCallback(async () => {
    const { data } = await axios.post(`${BASE_URL}/api/get-token-info`, {
      address,
    });

    setCoin(data);
    setIsLoading(false);
  }, [address]);

  useEffect(() => {
    fetchCoin();
  }, [address, fetchCoin]);

  return (
    <>
      {!!user?.id && <Header />}
      {isLoading && (
        <div className="pt-48">
          <Spinner />
        </div>
      )}
      <PageWrapper>
        {!!coin && (
          <div className="flex w-full h-full max-w-5xl">
            <div className="w-1/2 h-full flex flex-col justify-center items-center px-4">
              <Image
                src={coin.imageUrl}
                alt={`${coin.name} logo`}
                width={200}
                height={200}
                className="rounded-full block"
              />
              {!!coin?.symbol && (
                <div className="text-4xl my-4">
                  {coin.symbol.startsWith("$")
                    ? coin.symbol
                    : `$${coin.symbol}`}
                </div>
              )}
              <div className="mb-4">{coin.name}</div>
              <div className="mb-4 flex items-center space-x-2">
                <div>{getAbbreviatedAddress(coin.address)}</div>
                <CopyToClipboardButton text={address} />
              </div>
              <div className="mb-4 italic max-w-sm">
                {truncateDescription(coin.description)}
              </div>
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center px-4">
              <div className="mb-4 pt-16">
                Holders: {addCommasToNumber(coin.holderCount)}
              </div>
              {!!coin.totalSupply && (
                <div className="mb-4">
                  Total supply: {addCommasToNumber(coin.totalSupply)}
                </div>
              )}
              {!!coin.circulatingSupply && (
                <div className="mb-4">
                  Circulating supply:{" "}
                  {addCommasToNumber(coin.circulatingSupply)}
                </div>
              )}
              {(!!coin.burnedSupply || coin.burnedSupply === 0) && (
                <div className="mb-4">
                  Burned supply: {addCommasToNumber(coin.burnedSupply)}
                </div>
              )}
              {(!!coin.lockedSupply || coin.lockedSupply === 0) && (
                <div className="mb-4">
                  Locked supply: {addCommasToNumber(coin.lockedSupply)}
                </div>
              )}
              <div className="mb-4">
                Writable: {coin.isWritable ? "Yes" : "No"}
              </div>
              <div className="mb-4">
                Mint Authority: {coin.mintAuthority || "None"}
              </div>
              <div className="mb-4">
                Freeze Authority: {coin.freezeAuthority || "None"}
              </div>
              <div className="flex">
                {!!coin.website?.url && (
                  <div className="mb-4 mr-4">
                    <a
                      href={coin.website.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline"
                    >
                      site
                    </a>
                  </div>
                )}
                {!!coin.socials?.length && (
                  <div className="mb-4 space-x-4 flex">
                    {coin.socials.map((social) => (
                      <div className="mb-2" key={social.url}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="underline"
                        >
                          {social.type}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <TokenLinks address={address} symbol={coin?.symbol} />
      </PageWrapper>
    </>
  );
}
