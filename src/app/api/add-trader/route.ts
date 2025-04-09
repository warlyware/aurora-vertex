import { client } from "@/client/backend-client";
import { ADD_TRADER } from "@/graphql/mutations/add-trader";
import { ADD_WALLET } from "@/graphql/mutations/add-wallet";
import { GET_TRADER_BY_ADDRESS } from "@/graphql/queries/get-trader-by-address";
import { GET_WALLET_BY_ADDRESS } from "@/graphql/queries/get-wallet-by-address";
import { NextRequest, NextResponse } from "next/server";
import { messageTypes } from "@/types/websockets/messages";
import { AURORA_VERTEX_WS_URL, AURORA_VERTEX_FRONTEND_API_KEY } from "@/constants";
import WebSocket from "ws";

const { SOLANA_REFRESH_ACCOUNTS_TO_WATCH } = messageTypes;

export async function POST(req: NextRequest) {
  const {
    address,
    name,
    description,
  }: {
    address: string;
    name: string;
    description: string;
  } = await req?.json();

  if (!address) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Address is required",
      },
    });
  }

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
        name,
        description,
      }
    },
  });

  console.log({ insert_traders_one });

  // Send message to WebSocket server to refresh accounts
  const ws = new WebSocket(`${AURORA_VERTEX_WS_URL}/?auth=${AURORA_VERTEX_FRONTEND_API_KEY}&userId=SYSTEM`);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      type: SOLANA_REFRESH_ACCOUNTS_TO_WATCH,
    }));
    ws.close();
  });

  return NextResponse.json({
    status: 200,
    trader: insert_traders_one,
  });
}
