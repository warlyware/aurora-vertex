import { createJupiterApiClient, QuoteGetSwapModeEnum } from '@jup-ag/api';

const jupiterQuoteApi = createJupiterApiClient();

export async function getQuote(
    inputTokenAddress: string = "So11111111111111111111111111111111111111112",
    outputTokenAddress: string = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    amountToSwap: number,
    swapMode: QuoteGetSwapModeEnum = QuoteGetSwapModeEnum.ExactIn
) {
    if (!amountToSwap) {
        throw new Error("amountToSwap is required");
    }
    const quote = await jupiterQuoteApi.quoteGet({
        inputMint: inputTokenAddress,
        outputMint: outputTokenAddress,
        amount: amountToSwap,
        swapMode,
    });

    if (!quote) {
        throw new Error("unable to quote");
    }

    return quote;
}
