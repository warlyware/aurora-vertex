import { NextRequest, NextResponse } from "next/server";

type GetTokenSecurityInput = {
  address: string;
};

export type BirdEyeTokenSecurityResponse = {
  creatorAddress?: string;
  ownerAddress?: string;
  creationTx?: string;
  creationTime?: string;
  creationSlot?: string;
  mintTx: string;
  mintTime: number;
  mintSlot: string;
  creatorBalance: number;
  ownerBalance: number;
  ownerPercentage: number;
  creatorPercentage: string;
  metaplexUpdateAuthority?: string;
  metaplexUpdateAuthorityBalance: number;
  metaplexUpdateAuthorityPercent: number;
  mutableMetadata: boolean;
  top10HolderBalance: number;
  top10HolderPercent: number;
  top10UserBalance: number;
  top10UserPercent: number;
  isTrueToken?: boolean;
  totalSupply: number;
  preMarketHolder: [];
  lockInfo: any;
  freezeable: boolean;
  freezeAuthority?: string;
  transferFeeEnable: boolean;
  transferFeeData: any;
  isToken2022?: boolean;
  nonTransferable?: boolean;
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
    `https://public-api.birdeye.so/defi/token_security?address=${body.address}`,
    {
      headers: {
        "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
      },
    }
  );

  const { data }: { data: BirdEyeTokenSecurityResponse } =
    await birdeyeResponse.json();

  return NextResponse.json({
    status: 200,
    ...data,
  });
}
