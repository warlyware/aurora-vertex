import { GetTokenInfoFromDasResponse } from "@/app/api/get-token-info-from-das/route";
import { BASE_URL } from "@/constants";
import { getTokenHolders } from "@/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address } = await req?.json();

  if (!address) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: 400,
    });
  }

  const { data: dexscreenerData } = await axios.post(
    `${BASE_URL}/api/get-token-info-from-dexscreener`,
    {
      address,
    }
  );

  const { holders, total } = await getTokenHolders(address);

  const tokenInfo = {
    ...dexscreenerData,
    holders,
    holderCount: total,
  };

  return NextResponse.json({
    ...tokenInfo,
    status: 200,
  });
}
