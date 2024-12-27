import { getQuote } from "@/utils/quote";
import { NextRequest, NextResponse } from "next/server";

type GetTokenPriceInput = {
  inputTokenAddress: string;
  outputTokenAddress: string;
};

export async function POST(req: NextRequest) {
  const { amountToSwap, inputTokenAddress, outputTokenAddress } =
    await req?.json();

  console.log({
    amountToSwap,
    inputTokenAddress,
    outputTokenAddress,
  })

  const quote = await getQuote(
    inputTokenAddress,
    outputTokenAddress,
    amountToSwap
  );

  return NextResponse.json({
    status: 200,
    data: quote,
  });
}
