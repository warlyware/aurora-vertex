import { AURORA_VERTEX_API_URL } from "@/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { data, status } = await axios.post(
    `${AURORA_VERTEX_API_URL}/update/token-list`
  );

  return NextResponse.json({
    ...data,
    status,
  });
}
