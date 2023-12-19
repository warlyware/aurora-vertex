import { client } from "@/client/backend-client";
import { BASE_URL } from "@/constants";
import { ADD_TRADER } from "@/graphql/mutations/add-trader";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address }: { address: string } = await req?.json();

  if (!address) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Address is required",
      },
    });
  }

  const { data } = await axios.post(
    `${BASE_URL}/api/get-wallet-portfolio-from-birdeye`,
    {
      address,
    }
  );

  console.log({ data });
  const trader = {};

  const {
    insert_wallets_one,
  }: {
    insert_wallets_one: {
      id: string;
      address: string;
    };
  } = await client.request({
    document: ADD_TRADER,
    variables: {
      trader: {
        address,
        name: address,
      },
    },
  });

  return NextResponse.json({
    status: 200,
    ...data,
    coins: data?.items,
  });
}
