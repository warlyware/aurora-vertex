import { client } from "@/client/backend-client";
import { ADD_COINS } from "@/graphql/mutations/add-coins";
import { GET_COIN_BY_ADDRESS } from "@/graphql/queries/get-coin-by-address";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    address,
    name,
  }: {
    address: string,
    name: string,
    chain: string,
  } = await req?.json();

  if (!address) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Address is required",
      },
    });
  }

  const { coins }: {
    coins: {
      id: string;
    }[];
  } = await client.request({
    document: GET_COIN_BY_ADDRESS,
    variables: {
      address,
    },
  });

  if (coins.length) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Coin already exists",
      },
    });
  }

  const { insert_coins }: {
    insert_coins: {
      id: string;
    }[]
  } =
    await client.request({
      document: ADD_COINS,
      variables: {
        coins: [{
          address,
          name,
        }]
      },
    });


  if (!insert_coins?.length) {
    return NextResponse.json({
      status: 500,
      body: {
        error: "Failed to add coin",
      },
    });
  }
}
