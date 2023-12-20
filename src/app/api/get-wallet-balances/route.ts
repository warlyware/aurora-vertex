import { GetTokenInfoFromDasResponse } from "@/app/api/get-token-info-from-das/route";
import { BASE_URL } from "@/constants";
import { getTokenHolders } from "@/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export type TokenBalance = {
  tokenAccount: string;
  mint: string;
  amount: number;
  decimals: number;
};

export async function POST(req: NextRequest) {
  const { address, mintAddresses } = await req.json();

  if (!address) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: 400,
    });
  }

  if (!process.env.HELIUS_API_KEY) {
    return NextResponse.json({
      error: "Configuration error: missing Helius API key",
      status: 400,
    });
  }

  const url = `https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${process.env.HELIUS_API_KEY}`;

  const { data } = await axios.get(url);
  console.log({
    url,
    data,
  });

  let {
    tokens: balances,
    nativeBalance: lamportsBalance,
  }: { tokens: TokenBalance[]; nativeBalance: number } = data;

  if (mintAddresses && mintAddresses.length > 0) {
    balances = balances.filter((balance) =>
      mintAddresses.includes(balance.mint)
    );
  }

  balances = balances
    .filter((balance) => balance.amount > 0)
    .filter((balance) => balance.decimals > 0 && balance.amount > 1) // Only SPLs
    .sort((a, b) => b.amount - a.amount);

  const solBalance = lamportsBalance / 10 ** 9;

  return NextResponse.json({
    balances: {
      sol: solBalance,
      splTokens: balances,
    },
    status: 200,
  });
}
