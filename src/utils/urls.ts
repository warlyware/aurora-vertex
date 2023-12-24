export const getSolscanTokenUrl = (address: string) =>
  `https://solscan.io/token/${address}`;
export const getBirdEyeTokenUrl = (address: string) =>
  `https://birdeye.so/token/${address}?chain=solana`;
export const getSolanaFmTokenUrl = (address: string) =>
  `https://solana.fm/address/${address}`;
export const getSolanaExplorerTokenUrl = (address: string) =>
  `https://explorer.solana.com/address/${address}`;
export const getDexscreeenerTokenUrl = (address: string) =>
  `https://dexscreener.com/solana/${address}`;
export const getJupiterSwapUrl = (
  toAddress: string,
  fromAddress: string = "SOL"
) => `https://jup.ag/swap/${fromAddress}-${toAddress}`;
export const getRaydiumSwapUrl = (address: string) =>
  `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=6sEBEFa4djEbQyYor8DTR4xKP95gks3zZ5HxNzXMnJM2&fixed=in`;
export const getOrcaSwapUrl = (address: string) =>
  `https://www.orca.so/?outputCurrency=${address}`;
export const getRugCheckUrl = (address: string) =>
  `https://rugcheck.xyz/tokens/${address}`;
export const getTwitterSearchUrl = (address: string) =>
  `https://twitter.com/search?q=${address}`;
