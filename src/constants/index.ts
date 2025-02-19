export const BASE_URL = "http://localhost:3000";
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT as string || 'https://rpc-proxy.warly42.workers.dev';
export const RAYDIUM_TOKEN_DATA_JSON_URL =
  "https://api.raydium.io/v2/sdk/token/raydium.mainnet.json";
export const AURORA_VERTEX_FRONTEND_API_KEY = process.env.NEXT_PUBLIC_AURORA_VERTEX_FRONTEND_API_KEY as string;

export const RAYDIUM_LIQUIDITY_POOL_DATA_JSON_URL =
  "https://api.raydium.io/v2/sdk/liquidity/mainnet.json";
export const RAYDIUM_STAKING_POOL_DATA_JSON_URL =
  "https://api.raydium.io/v2/sdk/farm/mainnet.json";
export const SOL_TOKEN_ADDRESS = "So11111111111111111111111111111111111111112";
export const JUPITER_TOKEN_LIST_ALL_URL = "https://token.jup.ag/all";
export const JUPITER_TOKEN_LIST_STRICT_URL = "https://token.jup.ag/strict";
export const AURORA_VERTEX_API_URL = process.env.NEXT_PUBLIC_AURORA_VERTEX_API_URL as string || 'http://localhost:3002';
export const AURORA_VERTEX_WS_URL = process.env.NEXT_PUBLIC_AURORA_VERTEX_WS_URL as string || 'http://localhost:3002';
// export const AURORA_VERTEX_API_URL = 'https://api.auroravertex.click';
// export const AURORA_VERTEX_WS_URL = 'wss://api.auroravertex.click';
// export const AURORA_VERTEX_WS_URL = process.env
//   .NEXT_PUBLIC_AURORA_VERTEX_WS_URL as string;

