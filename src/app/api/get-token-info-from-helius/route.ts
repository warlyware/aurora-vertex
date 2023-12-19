import { HeliusTokenMetadataResponse } from "@/constants/helius";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export type GetTokenInfoFromHeliusResponse = {
  address: string;
  isSigner: boolean;
  isWritable: boolean;
  decimals: number;
  name: string;
  symbol: string;
  imageUrl: string;
  offChainMetadataUrl: string;
  tokenStandard: string;
  key: string;
  sellerFeeBasisPoints: number;
  legacyMetadata?: {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI: string;
    tags: null;
    extensions: {
      coingeckoId: string;
      serumV3Usdc: string;
      website: string;
    };
  };
  description: string;
  isMutable: boolean;
  editionNonce: number;
  uses: { useMethod: string; remaining: number; total: number };
  collection?: any;
  collectionDetails?: any;
  mintAuthority: string;
  freezeAuthority: string;
};

export async function POST(req: NextRequest) {
  const { address } = await req?.json();

  if (!address) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: 400,
    });
  }

  if (!process.env.HELIUS_API_KEY) {
    return NextResponse.json({
      error: "Configuration error: missing Helius API key",
      status: 400,
    });
  }

  const heliusTokenMetadataUrl = `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.HELIUS_API_KEY}&address=${address}`;

  let returnData: HeliusTokenMetadataResponse[] | null = null;

  try {
    const { data } = await axios.post(heliusTokenMetadataUrl, {
      mintAccounts: [address],
      includeOffChain: true,
    });

    if (!data) {
      return NextResponse.json({
        error: "No account found",
        status: 404,
      });
    }

    if (data?.data?.error) {
      console.log("data?.data?.error", data?.data?.error);
      return NextResponse.json({
        error: data?.data?.error,
        status: 500,
      });
    }

    returnData = data;

    console.log("data", JSON.stringify(data));
  } catch (error) {
    console.log("error", error);
  }

  const mappedData = returnData?.map((item: any) => {
    const {
      account,
      onChainAccountInfo,
      onChainMetadata,
      offChainMetadata,
      legacyMetadata,
    } = item;

    const supply = onChainAccountInfo?.accountInfo?.data?.parsed?.info?.supply;

    console.log({ supply });

    return {
      address: account,
      mintAuthority:
        onChainAccountInfo?.accountInfo?.data?.parsed?.info?.mintAuthority,
      freezeAuthority:
        onChainAccountInfo?.accountInfo?.data?.parsed?.info?.freezeAuthority,
      isInitialized:
        onChainAccountInfo?.accountInfo?.data?.parsed?.info?.isInitialized,
      isSigner: onChainAccountInfo?.accountInfo?.isSigner,
      isWritable: onChainAccountInfo?.accountInfo?.isWritable,
      decimals: onChainMetadata?.metadata?.data?.decimals,
      name: onChainMetadata?.metadata?.data?.name,
      symbol: onChainMetadata?.metadata?.data?.symbol,
      imageUrl: offChainMetadata?.metadata?.image || legacyMetadata?.logoURI,
      offChainMetadataUrl: offChainMetadata?.uri,
      tokenStandard: offChainMetadata?.metadata?.tokenStandard,
      key: offChainMetadata?.metadata?.key,
      sellerFeeBasisPoints:
        onChainMetadata?.metadata?.data?.sellerFeeBasisPoints,
      legacyMetadata,
      description: offChainMetadata?.metadata?.description,
      isMutable: offChainMetadata?.metadata?.isMutable,
      editionNonce: offChainMetadata?.metadata?.editionNonce,
      uses: offChainMetadata?.metadata?.uses,
      collection: onChainMetadata?.metadata?.collection,
      collectionDetails: onChainMetadata?.metadata?.collectionDetails,
    };
  })?.[0];

  return NextResponse.json({
    ...mappedData,
    status: 200,
  });
}
