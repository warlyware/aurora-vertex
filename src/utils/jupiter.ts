import { SOL_TOKEN_ADDRESS } from "@/constants";
import { VersionedTransaction } from "@solana/web3.js";

export const getSwapRouteMap = async (from: string, to: string) => {
  // Retrieve the `indexed-route-map`
  const indexedRouteMap = await (
    await fetch("https://quote-api.jup.ag/v6/indexed-route-map")
  ).json();
  const getMint = (index: string) => indexedRouteMap["mintKeys"][index];
  const getIndex = (mint: string) => indexedRouteMap["mintKeys"].indexOf(mint);

  // Generate the route map by replacing indexes with mint addresses
  const generatedRouteMap: any = {};
  Object.keys(indexedRouteMap["indexedRouteMap"]).forEach((key, index) => {
    generatedRouteMap[getMint(key)] = indexedRouteMap["indexedRouteMap"][
      key
    ].map((index: string) => getMint(index));
  });

  // List all possible input tokens by mint address
  const allInputMints = Object.keys(generatedRouteMap);

  // List all possition output tokens that can be swapped from the mint address for SOL.
  // SOL -> X
  const swappableOutputForSOL = generatedRouteMap[SOL_TOKEN_ADDRESS];

  console.log({ allInputMints, swappableOutputForSOL });

  return {
    allInputMints,
    swappableOutputForSOL,
  };
};

export const signAndSendSwapTransaction = async (
  connection: any,
  transaction: any
) => {
  const rawTransaction = transaction.serialize();
  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    maxRetries: 2,
  });
  await connection.confirmTransaction(txid);
  console.log(`https://solscan.io/tx/${txid}`);
};

export const getDeserializeSwapTransaction = async (serializedTx: string) => {
  const swapTransactionBuf = Buffer.from(serializedTx, "base64");
  return VersionedTransaction.deserialize(swapTransactionBuf);
};

export const createSwapTransaction = async (
  quoteFromJupiter: any,
  walletAddress: string
) => {
  // get serialized transactions for the swap
  const { swapTransaction } = await (
    await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // quoteResponse from /quote api
        quoteResponse: quoteFromJupiter,
        // user public key to be used for the swap
        userPublicKey: walletAddress,
        // auto wrap and unwrap SOL. default is true
        wrapAndUnwrapSol: true,
        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // feeAccount: "fee_account_public_key"
      }),
    })
  ).json();
};

export const getQuoteFromJupiter = async (
  baseAmount: number,
  outputAddress: string,
  inputAddress: string = SOL_TOKEN_ADDRESS,
  allowedSlippageInPercent: number = 0.5
) => {
  const amount = String(baseAmount);
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputAddress}&outputMint=${outputAddress}&amount=${amount}&slippageBps=${
    allowedSlippageInPercent * 100
  }`;
  console.log({ url });
  debugger;
  return await (await fetch(url)).json();
};
