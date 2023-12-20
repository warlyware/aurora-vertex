import { User } from "@nhost/nhost-js";

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  priceInUSD: number;
  decimals: number;
  totalSupply: number;
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
