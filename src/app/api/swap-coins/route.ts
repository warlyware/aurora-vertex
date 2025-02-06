import { RPC_ENDPOINT, SOL_TOKEN_ADDRESS } from "@/constants";
import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { client } from "@/client/backend-client";
import { getStringFromByteArrayString } from "@/utils/solana";
import { GET_WALLET_KEYPAIR_BY_ADDRESS } from "@/graphql/queries/get-wallet-keypair-by-address";
import { getSignature, Jupiter, RouteInfo, SwapResult } from '@jup-ag/core';
import { Wallet } from "@project-serum/anchor";
import { getQuote } from "@/utils/quote";
import { createJupiterApiClient, QuoteGetSwapModeEnum, QuoteResponse } from "@jup-ag/api";
import { transactionSenderAndConfirmationWaiter } from "@/utils/send-tx";
import { getTokenPrice } from "@/utils/token-price";

const jupiterQuoteApi = createJupiterApiClient();


async function getSwapObj(wallet: Wallet, quote: QuoteResponse) {
  // Get serialized transaction
  const swapObj = await jupiterQuoteApi.swapPost({
    swapRequest: {
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toBase58(),
      dynamicComputeUnitLimit: true,
      dynamicSlippage: {
        // This will set an optimized slippage to ensure high success rate
        maxBps: 300, // Make sure to set a reasonable cap here to prevent MEV
      },
      // prioritizationFeeLamports: {
      //     priorityLevelWithMaxLamports: {
      //         maxLamports: 10000000,
      //         priorityLevel: "veryHigh", // If you want to land transaction fast, set this to use `veryHigh`. You will pay on average higher priority fee.
      //     },
      // },
    },
  });
  return swapObj;
}

export async function POST(req: NextRequest) {
  const { amountToSwap: amountToSwapRaw, amountToSwapInUsd, inputTokenAddress, outputTokenAddress, walletAddress, simulationOnly } =
    await req?.json();

  let amountToSwap = amountToSwapRaw;

  console.log("POST /api/swap-coins", {
    amountToSwapRaw,
    amountToSwapInUsd,
    inputTokenAddress,
    outputTokenAddress,
    walletAddress,
    simulationOnly
  });

  if (amountToSwapInUsd && amountToSwapRaw) {
    return NextResponse.json({
      error: "Only one of amountToSwap or amountToSwapInUsd should be provided",
      status: 400,
    });
  }

  if (
    (!amountToSwapRaw && !amountToSwapInUsd) ||
    !inputTokenAddress ||
    !outputTokenAddress ||
    !walletAddress
  ) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: 400,
    });
  }

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

  const walletFromDb = wallets?.[0];

  if (!walletFromDb?.id) {
    return NextResponse.json({
      error: "Wallet not found",
      status: 404,
    });
  }

  if (!walletFromDb.keypair?.privateKey) {
    return NextResponse.json({
      error: "Wallet private key not found",
      status: 404,
    });
  }

  const privateKey = getStringFromByteArrayString(
    `[${walletFromDb.keypair.privateKey}]`
  );

  const byteValues = walletFromDb.keypair.privateKey.split(",").map(Number);
  const buffer = Buffer.from(byteValues);
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const secretKey = Uint8Array.from(byteValues);
  const keypair = Keypair.fromSecretKey(secretKey);
  const wallet = new Wallet(keypair);

  let quote: QuoteResponse;

  if (amountToSwapInUsd) {
    const { rawTokenAmountPerUsd } = await getTokenPrice(outputTokenAddress);

    amountToSwap = Math.floor(rawTokenAmountPerUsd * amountToSwapInUsd);

    console.log('getting quote', {
      inputTokenAddress,
      outputTokenAddress,
      amountToSwap
    });

    quote = await getQuote(
      inputTokenAddress,
      outputTokenAddress,
      amountToSwap,
      QuoteGetSwapModeEnum.ExactOut
    );
  } else {
    quote = await getQuote(
      inputTokenAddress,
      outputTokenAddress,
      amountToSwap
    );
  }


  console.dir(quote, { depth: null });

  const swapObj = await getSwapObj(wallet, quote);
  console.dir(swapObj, { depth: null });

  try {
    // Serialize the transaction
    const swapTransactionBuf = Buffer.from(swapObj.swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(new Uint8Array(swapTransactionBuf));

    // Sign the transaction
    transaction.sign([wallet.payer]);
    const signature = getSignature(transaction);

    // We first simulate whether the transaction would be successful
    const { value: simulatedTransactionResponse } =
      await connection.simulateTransaction(transaction, {
        replaceRecentBlockhash: true,
        commitment: "processed",
      });
    const { err, logs } = simulatedTransactionResponse;

    if (err) {
      // Simulation error, we can check the logs for more details
      // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
      console.error("Simulation Error:");
      console.error({ err, logs });
      return NextResponse.json({
        error: {
          message: err,
          logs,
          type: "Simulation Error",
        },
        status: 500,
      });
    }

    if (simulationOnly) {
      return NextResponse.json({
        simulation: {
          simulatedTransactionResponse,
          logs,
        },
      });
    } else {
      const serializedTransaction = Buffer.from(transaction.serialize());
      const blockhash = transaction.message.recentBlockhash;

      const transactionResponse = await transactionSenderAndConfirmationWaiter({
        connection,
        serializedTransaction,
        blockhashWithExpiryBlockHeight: {
          blockhash,
          lastValidBlockHeight: swapObj.lastValidBlockHeight,
        },
      });

      // If we are not getting a response back, the transaction has not confirmed.
      if (!transactionResponse) {
        console.error("Transaction not confirmed");
        return;
      }

      if (transactionResponse.meta?.err) {
        console.error(transactionResponse.meta?.err);
      }

      console.log(`https://solscan.io/tx/${signature}`);

      return NextResponse.json({
        signature,
      });
    }
  }

  catch (error: any) {
    console.error(error);
    return NextResponse.json({
      error: error?.message,
      status: 500,
    });
  }
}
