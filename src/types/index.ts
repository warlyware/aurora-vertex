import { User } from "@nhost/nhost-js";

export type TokenBalance = {
  tokenAccount: string;
  mint: string;
  amount: number;
  decimals: number;
  symbol: string;
  name: string;
};

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  priceInUSD: number;
  decimals: number;
  totalSupply: number;
  address: string;
};

type Bot = unknown;

export type Wallet = {
  id: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  keypair?: {
    publicKey: string;
    privateKey: string;
  };
  bot?: Bot;
  user: User;
  isActiveWallet: boolean;
};

export type EnhancedWallet = Wallet & {
  shortAddress: string | null;
  balances: {
    splTokens: TokenBalance[];
    sol: number;
  };
};

export interface Trader {
  id: string;
  name: string;
  createdAt: string;
  wallet: {
    id: string;
  }
};