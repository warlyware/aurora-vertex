import { AURORA_VERTEX_API_URL } from "@/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export type BirdEyeTokenCreationInfoResponse = {
  txHash: string;
  slot: number;
  tokenAddress: string;
  decimals: number;
  owner: string;
};

export async function GET(req: NextRequest) {
  const { data, status } = await axios.get(
    `${AURORA_VERTEX_API_URL}/latest-token-list`
  );

  return NextResponse.json({
    status,
    ...data,
  });
}
