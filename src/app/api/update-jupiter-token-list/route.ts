import { client } from "@/client/backend-client";
import { BASE_URL } from "@/constants";
import { ADD_COINS_ON_JUPITER } from "@/graphql/mutations/add-coins-on-jupiter";
import { ADD_TRADER } from "@/graphql/mutations/add-trader";
import { GET_COINS_ON_JUPITER } from "@/graphql/queries/get-coins-on-jupiter";
import { Coin } from "@/types";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type CoinFromJupiter = {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
  tags: string[];
};

export async function POST(req: NextRequest) {
  const {
    coinsOnJupiter,
  }: {
    coinsOnJupiter: Coin[];
  } = await client.request({
    document: GET_COINS_ON_JUPITER,
  });

  const {
    data,
  }: {
    data: {
      tokens: CoinFromJupiter[];
    };
  } = await axios.post(`${BASE_URL}/api/get-token-list-from-jupiter`);

  const newCoins = data?.tokens
    ?.filter(
      (token) =>
        !coinsOnJupiter.find(
          (coin) => coin.address.toLowerCase() === token.address.toLowerCase()
        )
    )
    .map((token) => ({
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      imageUrl: token.logoURI,
      decimals: token.decimals,
    }));

  console.log({
    oldCoinsCount: coinsOnJupiter.length,
    newCoinsCount: data?.tokens?.length,
    coinsOnJupiterCount: coinsOnJupiter.length,
  });

  try {
    const {
      insert_coinsOnJupiter,
    }: {
      insert_coinsOnJupiter: {
        affected_rows: number;
        returning: Coin[];
      };
    } = await client.request({
      document: ADD_COINS_ON_JUPITER,
      variables: {
        coins: newCoins,
      },
    });

    return NextResponse.json({
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      status: 500,
      coinCount: data?.tokens?.length,
      newCoins,
    });
  }
}
