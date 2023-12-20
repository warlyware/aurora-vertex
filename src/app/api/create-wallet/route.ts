import { client } from "@/client/backend-client";
import { ADD_KEYPAIR } from "@/graphql/mutations/add-keypair";
import { ADD_WALLET } from "@/graphql/mutations/add-wallet";
import { Keypair } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  const keypair = Keypair.generate();

  const publicKey = keypair.publicKey.toString();
  const privateKey = keypair.secretKey.toString();

  console.log({
    publicKey,
    privateKey,
  });

  try {
    const {
      insert_keypairs_one,
    }: {
      insert_keypairs_one: {
        id: string;
        address: string;
      };
    } = await client.request({
      document: ADD_KEYPAIR,
      variables: {
        keypair: {
          privateKey,
          publicKey,
        },
      },
    });

    const keypairId = insert_keypairs_one.id;

    const {
      insert_wallets_one,
    }: {
      insert_wallets_one: {
        id: string;
        address: string;
        userId: string;
      };
    } = await client.request({
      document: ADD_WALLET,
      variables: {
        address: publicKey,
        keypairId,
        userId,
      },
    });

    return NextResponse.json({
      status: 200,
      ...insert_wallets_one,
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
