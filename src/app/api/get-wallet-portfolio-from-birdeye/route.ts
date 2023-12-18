import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.BIRDEYE_API_KEY) {
    return NextResponse.json({
      status: 500,
      body: {
        error: "BIRDEYE_API_KEY is not defined in .env",
      },
    });
  }

  const { address }: { address: string } = await req?.json();

  if (!address) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Address is required",
      },
    });
  }

  const birdeyeResponse = await fetch(
    `https://public-api.birdeye.so/v1/wallet/token_list?wallet=${address}&x-chain=solana`,
    {
      headers: {
        "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
      },
    }
  );

  const { data }: { data: any } = await birdeyeResponse.json();

  console.log({ data });

  return NextResponse.json({
    status: 200,
    ...data,
    coins: data?.tokens,
  });
}
