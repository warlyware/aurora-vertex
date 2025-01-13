"use client";
import { GetTokenInfoFromDasResponse } from "@/app/api/get-token-info-from-das/route";
import { GetTokenInfoFromDexscreenerResponse } from "@/app/api/get-token-info-from-dexscreener/route";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { TokenLinks } from "@/components/tokens/token-links";
import { BASE_URL } from "@/constants";
import { HolderFromSolscan } from "@/types/solscan";
import { addCommasToNumber, } from "@/utils/formatting";
import axios from "axios";
import { useCallback, useEffect, useState, use } from "react";

type CoinInfo = GetTokenInfoFromDasResponse &
  GetTokenInfoFromDexscreenerResponse & {
    holders: HolderFromSolscan[];
    holderCount: number;
  };

export default function CoinDetailPage(props: { params: Promise<any> }) {
  const params = use(props.params);
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
      <PageWrapper>
        {!!coin && (
          <div className="flex w-full h-full max-w-5xl">
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
