import { GetTokenListFromBirdEyeResponse } from "@/app/api/get-token-list-from-birdeye/route";
import { client } from "@/client/backend-client";
import { BASE_URL } from "@/constants";
import { ADD_COINS } from "@/graphql/mutations/add-coins";
import { UPDATE_COIN_BY_ADDRESS } from "@/graphql/mutations/update-coin-by-address";
import { UPDATE_COINS } from "@/graphql/mutations/update-coins";
import { GET_COINS } from "@/graphql/queries/get-coins";
import axios from "axios";
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

  const { data }: { data: GetTokenListFromBirdEyeResponse } = await axios.post(
    `${BASE_URL}/api/get-token-list-from-birdeye`,
    {
      sortBy: "v24hUSD",
      sortType: "desc",
      offset: 0,
      limit: 50,
    }
  );

  console.log({ data, coins: data?.coins });

  let coins = data?.coins.map((coin) => {
    return {
      name: coin.name,
      address: coin.address,
      decimals: coin.decimals,
      lastTradeUnixTime: coin.lastTradeUnixTime,
      liquidity: coin.liquidity,
      imageUrl: coin.logoURI,
      symbol: coin.symbol,
      marketCap: coin.mc,
      v24hrUSD: coin.v24hUSD,
      v24hrChangePercent: coin.v24hChangePercent,
    };
  });

  // first get existing coins
  const {
    coins: existingCoins,
  }: {
    coins: { address: string }[];
  } = await client.request({
    document: GET_COINS,
  });

  // filter out existing coins
  const coinsToAdd = coins.filter((coin) => {
    return !existingCoins.find((existingCoin) => {
      return existingCoin.address === coin.address;
    });
  });

  const {
    insert_coins,
  }: {
    insert_coins: {
      affected_rows: number;
      returning: { id: string; address: string; name: string }[];
    };
  } = await client.request({
    document: ADD_COINS,
    variables: {
      coins: coinsToAdd,
    },
  });

  // update remaining coins
  coins = coins.filter((coin) => {
    return !coinsToAdd.find((coinToAdd) => {
      return coinToAdd.address === coin.address;
    });
  });

  for (const coin of coins) {
    const {
      update_coins,
    }: {
      update_coins: {
        affected_rows: number;
        returning: { id: string; address: string; name: string }[];
      };
    } = await client.request({
      document: UPDATE_COIN_BY_ADDRESS,
      variables: {
        address: coin.address,
        coin,
      },
    });
  }

  return NextResponse.json({
    status: 200,
  });
}
