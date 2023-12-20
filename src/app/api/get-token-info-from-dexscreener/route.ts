import { DexscreenerCoinInfoResponse } from "@/types/dexscreener";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export type GetTokenInfoFromDexscreenerResponse = {
  socials: { type: string; url: string }[];
  description: string;
  name: string;
  symbol: string;
  image: string;
  website: {
    url: string;
    label: string;
  };
  lockedAddresses: string[];
  totalSupply: number;
  burnedSupply: number;
  lockedSupply: number;
  circulatingSupply: number;
};

export async function POST(req: NextRequest) {
  const { address } = await req?.json();

  if (!address) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: 400,
    });
  }

  const url = `https://io.dexscreener.com/dex/pair-details/v2/solana/${address}`;

  const res = await fetch(url, {
    method: "GET",
  });

  let data: DexscreenerCoinInfoResponse;

  try {
    data = await res.json();
    console.log({ data });

    const { ds, cg, ti } = data;

    const socials = ds?.socials || cg?.social || ti?.socials;
    const description = ds?.description || cg?.description || ti?.description;
    const name = ds?.name || ti?.name;
    const symbol = ds?.symbol || ti?.symbol;
    const image = ds?.image || cg?.imageUrl || ti?.image;
    const website = ds?.websites?.[0] || cg?.websites?.[0] || ti?.websites?.[0];
    const lockedAddresses = ds?.lockedAddresses || ti?.lockedAddresses;
    const totalSupply =
      ds?.supplies.totalSupply || cg?.totalSupply || ti?.supplies.totalSupply;
    const burnedSupply = ds?.supplies.burnedSupply || ti?.supplies.burnedSupply;
    const lockedSupply = ds?.supplies.lockedSupply || ti?.supplies.lockedSupply;
    const circulatingSupply =
      ds?.supplies.circulatingSupply || ti?.supplies.circulatingSupply;

    return NextResponse.json({
      status: 200,
      socials,
      description,
      name,
      symbol,
      image,
      website,
      lockedAddresses,
      totalSupply,
      burnedSupply,
      lockedSupply,
      circulatingSupply,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      error: "Something went wrong",
      status: 500,
    });
  }
}
