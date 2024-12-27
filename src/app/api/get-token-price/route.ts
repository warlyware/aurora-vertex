import { getTokenPrice } from "@/utils/token-price";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { tokenAddress } =
    await req?.json();

  console.log({
    tokenAddress,
  })

  const { price, rawTokenAmountPerUsd } = await getTokenPrice(tokenAddress);

  return NextResponse.json({
    status: 200,
    data: {
      price,
      rawTokenAmountPerUsd
    }
  });
}
