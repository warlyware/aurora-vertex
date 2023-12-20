import { client } from "@/client/backend-client";
import { ADD_KEYPAIR } from "@/graphql/mutations/add-keypair";
import { ADD_WALLET } from "@/graphql/mutations/add-wallet";
import { SET_ACTIVE_WALLET } from "@/graphql/mutations/set-active-wallet";
import { UNSET_ACTIVE_WALLET } from "@/graphql/mutations/uset-active-wallet";
import { GET_ACTIVE_WALLET } from "@/graphql/queries/get-active-wallet";
import { Wallet } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, address } = await req.json();
  try {
    const { wallets }: { wallets: Wallet[] } = await client.request({
      document: GET_ACTIVE_WALLET,
      variables: {
        userId,
      },
    });

    const activeWallet = wallets?.[0];

    console.log("activeWallet", activeWallet);

    if (activeWallet?.address === address) {
      return NextResponse.json({
        status: 200,
      });
    }

    if (activeWallet?.address) {
      for (const wallet of wallets) {
        await client.request({
          document: UNSET_ACTIVE_WALLET,
          variables: {
            address: wallet.address,
          },
        });
      }
    }

    await client.request({
      document: SET_ACTIVE_WALLET,
      variables: {
        address,
      },
    });

    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      body: {
        error: "Error creating wallet",
      },
    });
  }
}
