import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getQuote } from "./quote";

export const getTokenPrice = async (tokenAddress: string) => {

    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

    const mintInfo = await connection.getParsedAccountInfo(
        new PublicKey(tokenAddress)
    );

    let outputTokenDecimals;

    if (!mintInfo.value) {
        throw new Error('Invalid token address');
    }

    if ('parsed' in mintInfo.value?.data) {
        outputTokenDecimals = mintInfo.value.data.parsed.info.decimals;
    }

    const ONE_USDC_RAW = 1_000_000;

    const quote = await getQuote(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        tokenAddress,
        ONE_USDC_RAW
    );

    const { outAmount } = quote;

    const rawTokenAmountPerUsd = Number(outAmount);
    const rawTokenAmountWithDecimals = rawTokenAmountPerUsd / Math.pow(10, outputTokenDecimals);

    return {
        rawTokenAmountPerUsd,
        price: rawTokenAmountWithDecimals,
    }
};