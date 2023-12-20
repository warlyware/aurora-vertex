import { client } from "@/client/backend-client";
import { RPC_ENDPOINT } from "@/constants";
import { GET_COIN_BY_ADDRESS } from "@/graphql/queries/get-coin-by-address";
import { Coin, TokenBalance } from "@/types";
import {
  DasApiAsset,
  dasApi,
} from "@metaplex-foundation/digital-asset-standard-api";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

  const umi = await createUmi(RPC_ENDPOINT)
    .use(mplTokenMetadata())
    .use(dasApi());

  let symbol: string;
  let name: string;

  for (const balance of balances) {
    const {
      coins,
    }: {
      coins: Coin[];
    } = await client.request(GET_COIN_BY_ADDRESS, {
      address: balance.mint,
    });

    const coin = coins[0];

    if (coin) {
      symbol = coin.symbol;
      name = coin.name;
    } else {
      const asset = await umi.rpc.getAsset(publicKey(balance.mint));
      console.log({ asset });
      const dasApiAsset = asset as DasApiAsset;
      symbol = dasApiAsset?.content?.metadata?.symbol || "";
      name = dasApiAsset?.content?.metadata?.name || "";
    }
  }

  balances = balances.map((balance) => {
    return {
      ...balance,
      // prepend $ if symbol is missing currency symbol
      symbol: symbol.startsWith("$") ? symbol : `$${symbol}`,
      name,
    };
  });

  const solBalance = lamportsBalance / 10 ** 9;

  return NextResponse.json({
    balances: {
      sol: solBalance,
      splTokens: balances,
    },
    status: 200,
  });
}
