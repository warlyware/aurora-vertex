import { NextRequest, NextResponse } from "next/server";

type GetTokenSecurityInput = {
  address: string;
};

export type BirdEyeTokenCreationInfoResponse = {
  txHash: string;
  slot: number;
  tokenAddress: string;
  decimals: number;
  owner: string;
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

  const body: GetTokenSecurityInput = await req?.json();

  const birdeyeResponse = await fetch(
    `https://public-api.birdeye.so/defi/token_creation_info?address=${body.address}`,
    {
      headers: {
        "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
      },
    }
  );

  const { data }: { data: BirdEyeTokenCreationInfoResponse } =
    await birdeyeResponse.json();

  return NextResponse.json({
    status: 200,
    ...data,
  });
}
