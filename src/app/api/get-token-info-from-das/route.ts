import { RPC_ENDPOINT } from "@/constants";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { NextRequest, NextResponse } from "next/server";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { getTokenHolderCount, getTokenHolders } from "@/utils";

export type AssetFromDas = {
  interface: string;
  id: string;
  content: {
    $schema: string;
    json_uri: string;
    files: {
      uri: string;
      cdn_uri: string;
      mime: string;
    }[];
    metadata: {
      description: string;
      name: string;
      symbol: string;
      token_standard: string;
    };
    links: {
      image: string;
    };
  };
  authorities: {
    address: string;
    scopes: string[];
  }[];
  compression: {
    eligible: boolean;
    compressed: boolean;
    data_hash: string;
    creator_hash: string;
    asset_hash: string;
    tree: string;
    seq: number;
    leaf_id: number;
  };
  grouping?: [];
  royalty: {
    royalty_model: string;
    target?: unknown;
    percent: number;
    basis_points: number;
    primary_sale_happened: boolean;
    locked: boolean;
  };
  creators?: [];
  ownership: {
    frozen: boolean;
    delegated: boolean;
    delegate?: string;
    ownership_model: string;
    owner: string;
  };
  supply: null;
  mutable: boolean;
  burnt: boolean;
};

export type GetTokenInfoFromDasResponse = {
  asset: {
    holderCount: number;
  } & AssetFromDas;
  status: number;
};

export async function POST(req: NextRequest) {
  const { address } = await req?.json();

  if (!address) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: 400,
    });
  }

  const umi = await createUmi(RPC_ENDPOINT)
    .use(mplToolbox())
    .use(mplTokenMetadata())
    .use(dasApi());

  const asset = await umi.rpc.getAsset(address);

  return NextResponse.json({
    asset: {
      ...asset,
    },
    status: 200,
  });
}
