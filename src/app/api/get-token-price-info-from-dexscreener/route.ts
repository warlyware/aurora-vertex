import { DexscreenerCoinInfoResponse } from "@/types/dexscreener";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type TokenPairFromDexscreenerTxn = {
  buys: number;
  sells: number;
};

type TokenPairFromDexscreenerChanges = {
  m5: number;
  h1: number;
  h6: number;
  h24: number;
};

export type TokenPairFromDexscreener = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: TokenPairFromDexscreenerTxn[];
  volume: TokenPairFromDexscreenerChanges;
  priceChange: TokenPairFromDexscreenerChanges;
  liquidity: { usd: number; base: number; quote: number };
  fdv: number;
  pairCreatedAt: number;
};

export type PriceInfoFromDexscreener = {
  schemaVersion: string;
  pairs: TokenPairFromDexscreener[];
};

export async function POST(req: NextRequest) {
  const { address } = await req?.json();

  if (!address) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: 400,
    });
  }

  const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;

  const res = await fetch(url, {
    method: "GET",
  });

  let data: PriceInfoFromDexscreener;

  try {
    data = await res.json();
    console.log({ data });

    const { pairs } = data;

    if (!pairs) {
      return NextResponse.json({
        error: "No pairs found",
        status: 404,
      });
    }

    // find the pair in the array with either baseToken.address equal to SOL_TOKEN_ADDRESS or quoteToken.address equal to SOL_TOKEN_ADDRESS
    const tokenInfo = pairs.find(
      (pair) =>
        pair.baseToken.address === address ||
        pair.quoteToken.address === address
    );

    return NextResponse.json({
      status: 200,
      tokenInfo,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      error: "Something went wrong",
      status: 500,
    });
  }
}
