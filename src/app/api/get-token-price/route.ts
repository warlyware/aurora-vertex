import { NextRequest, NextResponse } from "next/server";

type GetTokenPriceInput = {
  address: string;
};

export type BirdEyeTokenPriceResponse = {
  value: number;
  updateUnixTime: number;
  updateHumanTime: string;
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

  const body: GetTokenPriceInput = await req?.json();

  const birdeyeResponse = await fetch(
    `https://public-api.birdeye.so/defi/price?address=${body.address}`,
    {
      headers: {
        "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
      },
    }
  );

  const { data }: { data: BirdEyeTokenPriceResponse } =
    await birdeyeResponse.json();

  return NextResponse.json({
    status: 200,
    ...data,
  });
}
