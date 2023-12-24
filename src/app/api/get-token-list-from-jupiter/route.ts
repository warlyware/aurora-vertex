import { JUPITER_TOKEN_LIST_ALL_URL } from "@/constants";
import { DexscreenerCoinInfoResponse } from "@/types/dexscreener";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("fetching..");

  const res = await fetch(JUPITER_TOKEN_LIST_ALL_URL, {
    method: "GET",
  });

  let data;

  try {
    data = await res.json();
    console.log({ data });
    return NextResponse.json({
      status: 200,
      tokens: data,
    });
  } catch (error) {
    console.log({ error });
    console.error(error);
    return NextResponse.json({
      error: "Something went wrong",
      status: 500,
    });
  }
}
