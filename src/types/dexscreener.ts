type DexscreenerCoinGeckoCoinInfo = {
  id: string;
  url: string;
  description: string;
  maxSupply: number;
  totalSupply: number;
  circulatingSupply: number;
  websites: [{ label: string; url: string }];
  social: [{ type: string; url: string }, { type: string; url: string }];
  imageUrl: string;
  categories: string[];
};

type DexscreenerCoinInfo = {
  id: string;
  chain: { id: string };
  address: string;
  name: string;
  symbol: string;
  description: string;
  websites: unknown[];
  socials: { type: string; url: string }[];
  lockedAddresses: string[];
  supplies: {
    totalSupply: number;
    burnedSupply: number;
    lockedSupply: number;
    circulatingSupply: number;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  image: string;
};

export type DexscreenerCoinInfoResponse = {
  schemaVersion: string;
  cg?: DexscreenerCoinGeckoCoinInfo;
  gp?: unknown;
  ts?: unknown;
  cmc?: unknown;
  ti?: DexscreenerCoinInfo;
  ds?: DexscreenerCoinInfo;
  isBoostable: boolean;
};
