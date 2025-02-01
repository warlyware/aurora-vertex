import { isPublicKey } from "@metaplex-foundation/umi";
import axios from "axios";
import { SolscanTokenHoldersResponse } from "@/types/solscan";
import { EnhancedWallet, Wallet } from "@/types";

export type TokenHoldersList = {
  total: number;
  holders: {
    address: string;
    amount: number;
    decimals: number;
    owner: string;
    rank: number;
    withheldAmount: number;
  }[];
};

export const getAbbreviatedAddress = (
  address?: string | PublicKeyCredential | null,
  identifierLength: number = 6
) => {
  if (!address) return "";
  // check if it's a solana public key
  if (typeof address !== "string") {
    address = address.toString();
  }

  if (!address) return "";
  return `${address.slice(0, identifierLength)}...${address.slice(
    address.length - identifierLength
  )}`;
};

export const getTokenHolders = async (
  mintAddress: string
): Promise<TokenHoldersList> => {
  let count = 0;

  try {
    const { data }: { data: SolscanTokenHoldersResponse } = await axios.get(
      `https://api.solscan.io/v2/token/holders?token=${mintAddress}&offset=0&size=50`
    );

    console.log({ data });

    if (!data?.data) {
      return {
        total: 0,
        holders: [],
      };
    }

    return {
      total: data.data.total,
      holders: data.data.result,
    };
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    throw error;
  }
};

export const getTokenHolderCount = async (
  mintAddress: string
): Promise<number> => {
  const { total } = await getTokenHolders(mintAddress);
  return total;
};

export const createEnhancedWallet = (wallet: Wallet): EnhancedWallet => {
  return {
    ...wallet,
    shortAddress: getAbbreviatedAddress(wallet.address),
    balances: {
      splTokens: [],
      sol: 0,
    },
  };
};

export const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));