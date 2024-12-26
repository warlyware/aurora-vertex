import { NextRequest, NextResponse } from "next/server";

type GetWalletPortfolioInput = {
  address: string;
};

export type BirdEyeWalletPortfolioResponse = {
  wallet: string;
  totalUsd: number;
  items: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
    uiAmount: number;
    chainId: string;
  }[];
};

export async function POST(req: NextRequest) {
  if (!process.env.BIRDEYE_API_KEY) {
    return NextResponse.json({
      status: 500,
      body: {
        error: "BIRDEYE_API_KEY is not defined in .env",
      },
    });
  }

  const body: GetWalletPortfolioInput = await req?.json();
  //      --url 'https://public-api.birdeye.so/v1/wallet/token_list?wallet=0xf584f8728b874a6a5c7a8d4d387c9aae9172d621' \

  const birdeyeResponse = await fetch(
    `https://public-api.birdeye.so/v1/wallet/token_list?wallet=${body.address}`,
    {
      headers: {
        "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
      },
    }
  );

  const { data }: { data: BirdEyeWalletPortfolioResponse } =
    await birdeyeResponse.json();

  return NextResponse.json({
    status: 200,
    ...data,
  });
}
