import { client } from "@/client/backend-client";
import { ADD_TRADER } from "@/graphql/mutations/add-trader";
import { ADD_WALLET } from "@/graphql/mutations/add-wallet";
import { GET_TRADER_BY_ADDRESS } from "@/graphql/queries/get-trader-by-address";
import { GET_WALLET_BY_ADDRESS } from "@/graphql/queries/get-wallet-by-address";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address, name }: { address: string, name: string } = await req?.json();

  if (!address) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Address is required",
      },
    });
  }

  // check if trader already exists
  const { traders }: {
    traders: {
      id: string;
    }[];
  } = await client.request({
    document: GET_TRADER_BY_ADDRESS,
    variables: {
      address,
    },
  });

  if (traders?.length > 0) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Trader already exists",
      },
    });
  }

  const { wallets }: {
    wallets: {
      address: string;
      id: string;
    }[];
  } = await client.request({
    document: GET_WALLET_BY_ADDRESS,
    variables: {
      address,
    },
  });

  let walletId: string;

  if (wallets?.length > 0) {
    console.log("Wallet already exists, using existing wallet");

    walletId = wallets[0].id;
  } else {
    const {
      insert_wallets_one,
    }: {
      insert_wallets_one: {
        address: string;
        id: string;
      };
    } = await client.request({
      document: ADD_WALLET,
      variables: {
        address,
      },
    });

    walletId = insert_wallets_one.id;
  }

  const {
    insert_traders_one,
  }: {
    insert_traders_one: {
      id: string;
    };
  } = await client.request({
    document: ADD_TRADER,
    variables: {
      trader: {
        walletId,
        name: "Trader",
      }
    },
  });

  console.log({ insert_traders_one });

  return NextResponse.json({
    status: 200,
    trader: insert_traders_one,
  });
}
