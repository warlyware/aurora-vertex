import { RPC_ENDPOINT } from "@/constants";
import { Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import {
  TOKEN_PROGRAM_ID,
  Token,
  TokenAmount,
  TokenAmountType,
  TradeV2,
} from "@raydium-io/raydium-sdk";

export async function POST(req: NextRequest) {
  const { amountToSwap, inputTokenAddress, outputTokenAddress, walletAddress } =
    await req?.json();

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

  // Initialize Solana connection
  const connection = new Connection(RPC_ENDPOINT, "confirmed");

  // Define the trading parameters
  const inputTokenMint = new PublicKey(inputTokenAddress);
  const outputTokenMint = new PublicKey(outputTokenAddress);
  const walletPublicKey = new PublicKey(walletAddress);

  // const inputToken = new Token(
  //   TOKEN_PROGRAM_ID,
  //   inputTokenMint,
  //   inputTokenDecimals
  // );

  // const outputToken = new Token(
  //   TOKEN_PROGRAM_ID,
  //   outputTokenMint,
  //   outputTokenDecimals
  // );

  // const swapAmount = new TokenAmount(inputToken, amountToSwap); // 'amountToSwap' should be a raw amount in the smallest unit (like wei in Ethereum)

  // // Fetch pool information and compute trade routes
  // const allRoutesInfo = await TradeV2.getAllRoute({
  //   inputMint: inputTokenMint,
  //   outputMint: outputTokenMint,
  //   // Additional parameters like pool lists and flags
  // });

  // // Choose a route and prepare the swap info (simplified for this example)
  // const chosenRoute = allRoutesInfo.directPath[0]; // Simplified: choosing the first direct path
  // const swapInfo = {
  //   // Populate swap information based on chosen route and other factors
  //   // ...
  // };

  // // Create a swap transaction
  // const swapTransaction = await TradeV2.makeSwapInstructionSimple({
  //   connection,
  //   swapInfo,
  //   ownerInfo: {
  //     wallet: walletPublicKey,
  //     // Additional owner info parameters
  //   },
  //   routeProgram: chosenRoute.programId, // The program ID for the chosen route
  //   makeTxVersion: "YourTxVersion", // Define your transaction version
  //   // Other parameters as needed
  // });
}
