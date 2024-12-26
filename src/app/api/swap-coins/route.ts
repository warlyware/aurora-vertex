import { RPC_ENDPOINT, SOL_TOKEN_ADDRESS } from "@/constants";
import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  VersionedTransaction,
  PublicKey,
  sendAndConfirmRawTransaction,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, transactionBuilder } from "@metaplex-foundation/umi";
import { GET_WALLET_KEYPAIR_BY_ID } from "@/graphql/queries/get-wallet-keypair-by-id";
import { client } from "@/client/backend-client";
import { getStringFromByteArrayString } from "@/utils/solana";
import { GET_WALLET_KEYPAIR_BY_ADDRESS } from "@/graphql/queries/get-wallet-keypair-by-address";
import {
  getQuoteFromJupiter,
  getSerializedSwapTransaction,
} from "@/utils/jupiter";
import { getPriorityFeeEstimate } from "@/utils/fees";
import { transactionSenderAndConfirmationWaiter } from "@/utils/send-tx";
import { Jupiter, RouteInfo, SwapResult } from '@jup-ag/core';
import BN from 'bn.js';
import JSBI from "jsbi";

export async function POST(req: NextRequest) {
  const { amountToSwap, inputTokenAddress, outputTokenAddress, walletAddress } =
    await req?.json();
  console.log("POST /api/swap-coins", {
    amountToSwap,
    inputTokenAddress,
    outputTokenAddress,
    walletAddress,
  });
  if (
    !amountToSwap ||
    !inputTokenAddress ||
    !outputTokenAddress ||
    !walletAddress
  ) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: 400,
    });
  }

  console.log('correct parameters');

  // const inputTokenMint = new PublicKey(inputTokenAddress);
  // const outputTokenMint = new PublicKey(outputTokenAddress);
  // const walletPublicKey = new PublicKey(walletAddress);

  // const umi = await createUmi(RPC_ENDPOINT);
  // const umi = await createUmi("https://rpc-solana.birdeye.so/");

  const {
    wallets,
  }: {
    wallets: {
      address: string;
      id: string;
      keypair: {
        id: string;
        privateKey: string;
        publicKey: string;
      };
    }[];
  } = await client.request({
    document: GET_WALLET_KEYPAIR_BY_ADDRESS,
    variables: {
      address: walletAddress,
    },
  });

  const wallet = wallets?.[0];

  if (!wallet?.id) {
    return NextResponse.json({
      error: "Wallet not found",
      status: 404,
    });
  }

  if (!wallet.keypair?.privateKey) {
    return NextResponse.json({
      error: "Wallet private key not found",
      status: 404,
    });
  }

  const privateKey = getStringFromByteArrayString(
    `[${wallet.keypair.privateKey}]`
  );

  const byteValues = wallet.keypair.privateKey.split(",").map(Number);
  const buffer = Buffer.from(byteValues);

  console.log('pk', { keypairPk: wallet.keypair.privateKey, privateKey });

  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const secretKey = Uint8Array.from(byteValues);
  const keypair = Keypair.fromSecretKey(secretKey);

  console.log({ keypair });

  try {
    // ------------------------------------------------------------------------
    // 4. Load the Jupiter client
    // ------------------------------------------------------------------------
    const jupiter = await Jupiter.load({
      connection,
      cluster: 'mainnet-beta', // or 'devnet', 'testnet'
      user: keypair,
    });

    const ONE_USD_IN_LAMPORTS = JSBI.BigInt(1_000_000);
    const ONE_LAMPORT_IN_LAMPORTS = JSBI.BigInt(1);
    const ONE_PENNY_IN_LAMPORTS = JSBI.BigInt(10_000);
    const WSOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

    const { routesInfos, cached } = await jupiter.computeRoutes({
      // inputMint: new PublicKey(inputTokenAddress),
      inputMint: WSOL_MINT,
      outputMint: new PublicKey(outputTokenAddress),
      amount: ONE_LAMPORT_IN_LAMPORTS,
      slippageBps: 50, // 0.50% slippage
    });

    if (!routesInfos || routesInfos.length === 0) {
      console.error('No viable routes found.');
      return;
    }

    const bestRoute: RouteInfo = routesInfos[0];

    const {
      swapTransaction,
      addressLookupTableAccounts,
      execute,
    } = await jupiter.exchange({
      routeInfo: bestRoute,
      // optionally specify which public key is doing the swap (though it can infer from bestRoute)
      userPublicKey: keypair.publicKey,
      wrapUnwrapSOL: true
      // other optional fields: feeAccount, wrapUnwrapSOL, blockhashWithExpiryBlockHeight, etc.
    });

    const swapResultViaExecute: SwapResult = await execute();

    if ('error' in swapResultViaExecute) {
      // It's the failure shape
      console.error('Swap failed:', swapResultViaExecute.error);
    } else {
      // It's the success shape
      console.log('Swap succeeded!');
      if ('txid' in swapResultViaExecute) {
        console.log('Transaction ID:', swapResultViaExecute.txid);
        console.log('Input amount:', swapResultViaExecute.inputAmount);
        console.log('Output amount:', swapResultViaExecute.outputAmount);
      }
    }

  }

  catch (error: any) {
    console.error(error);
    return NextResponse.json({
      error: error?.message,
      status: 500,
    });
  }

  // const keypair = Keypair.fromSecretKey(buffer);

  // const quote = await getQuoteFromJupiter(
  //   amountToSwap,
  //   outputTokenAddress === "SOL" ? SOL_TOKEN_ADDRESS : outputTokenAddress,
  //   inputTokenAddress === "SOL" ? SOL_TOKEN_ADDRESS : inputTokenAddress,
  //   0.5
  // );

  // const feeEstimate = await getPriorityFeeEstimate();

  // const tx = await getSerializedSwapTransaction(
  //   quote,
  //   walletAddress,
  //   feeEstimate
  // );

  // console.log({ feeEstimate, tx });

  // const swapTransactionBuf = Buffer.from(tx, "base64");
  // var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

  // console.log(transaction);
  // transaction.sign([keypair]);

  // const connection = new Connection(RPC_ENDPOINT);

  // const { blockhash, lastValidBlockHeight } =
  //   await umi.rpc.getLatestBlockhash();

  // const rawTransaction = transaction.serialize();
  // try {
  //   const signature = await connection.sendRawTransaction(rawTransaction, {
  //     skipPreflight: true,
  //     maxRetries: 2,
  //   });

  //   const confirmation = await connection.confirmTransaction(
  //     {
  //       signature,
  //       blockhash,
  //       lastValidBlockHeight,
  //     },
  //     "confirmed"
  //   );

  //   console.log({ confirmation });

  //   return NextResponse.json({
  //     signature,
  //   });
  // } catch (error: any) {
  //   console.error(error);
  //   return NextResponse.json({
  //     error: error?.message,
  //     status: 500,
  //   });
  // }
}
