import { NextRequest, NextResponse } from "next/server";

type GetTokenTradesInput = {
  address: string;
};

export type BirdEyeTokenTradesResponse = {
  items: {
    base: {
      address: string;
      symbol: string;
      decimals: number;
      amount: number;
      uiAmount: number;
      price: number | null;
      nearestPrice: number;
      changeAmount: number;
      uiChangeAmount: number;
    };
    quote: {
      address: string;
      symbol: string;
      decimals: number;
      amount: number;
      uiAmount: number;
      price: number | null;
      nearestPrice: number;
      changeAmount: number;
      uiChangeAmount: number;
    };
    basePrice: number | null;
    quotePrice: number | null;
    side: string;
    owner: string;
    blockUnixTime: number;
    txType: string;
    source: string;
    txHash: string;
    alias: string | null;
    pricePair: number;
    from: {
      address: string;
      symbol: string;
      decimals: number;
      amount: number;
      uiAmount: number;
      price: number | null;
      nearestPrice: number;
      changeAmount: number;
      uiChangeAmount: number;
    };
    to: {
      address: string;
      symbol: string;
      decimals: number;
      amount: number;
      uiAmount: number;
      price: number | null;
      nearestPrice: number;
      changeAmount: number;
      uiChangeAmount: number;
    };
    tokenPrice: number | null;
    poolId: string;
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

  const body: GetTokenTradesInput = await req?.json();

  const birdeyeResponse = await fetch(
    `https://public-api.birdeye.so/defi/price?address=${body.address}`,
    {
      headers: {
        "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
      },
    }
  );

  const { data }: { data: BirdEyeTokenTradesResponse } =
    await birdeyeResponse.json();

  return NextResponse.json({
    status: 200,
    ...data,
  });
}
