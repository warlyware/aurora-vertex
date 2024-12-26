import { NextRequest, NextResponse } from "next/server";

export type GetTokenListFromBirdEyeInput = {
  sortBy?: "v24hUSD" | "mc" | "v24hChangePercent";
  sortType?: "asc" | "desc";
  offset?: number;
  limit?: number;
  pages?: number;
};

export type BirdEyeToken = {
  address: string;
  decimals: number;
  lastTradeUnixTime: number;
  liquidity: number;
  logoURI: string;
  mc: number;
  name: string;
  symbol: string;
  v24hChangePercent: number;
  v24hUSD: number;
};

export type GetTokenListFromBirdEyeResponse = {
  status: number;
  updateUnixTime: number;
  updateTime: string;
  total: number;
  coins: BirdEyeToken[];
};

export type BirdEyeTokenListResponse = {
  updateUnixTime: number;
  updateTime: string;
  tokens: BirdEyeToken[];
  total: number;
};

export async function POST(req: NextRequest) {
  if (!process.env.BIRDEYE_API_KEY) {
    return NextResponse.json({
      status: 500,
      body: {
        error: "BIRDEYE_API_KEY is not defined in .env",
      },
    });
  }

  let sortBy = "v24hUSD";
  let sortType = "desc";
  let offset = 0;
  let limit = 50;
  let pages = 1;

  const body: GetTokenListFromBirdEyeInput = await req?.json();

  if (body) {
    console.log({ body });

    if (body.sortBy) {
      sortBy = body.sortBy;
    }
    if (body.sortType) {
      sortType = body.sortType;
    }
    if (body.offset) {
      offset = body.offset;
    }
    if (body.limit) {
      limit = body.limit;
    }
  }

  if (body.pages && isNaN(body.pages)) {
    pages = 1;
  } else {
    pages = body.pages || 1;
  }

  console.log({ pages });

  if (pages === 1) {
    const birdeyeResponse = await fetch(
      `https://public-api.birdeye.so/defi/tokenlist?sort_by=${sortBy}&sort_type=${sortType}&offset=${offset}&limit=${limit}`,
      {
        headers: {
          "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
        },
      }
    );
    const { data }: { data: BirdEyeTokenListResponse } =
      await birdeyeResponse.json();

    return NextResponse.json({
      status: 200,
      ...data,
      coins: data?.tokens,
    });
  } else {
    let coins: BirdEyeToken[] = [];
    for (let i = 0; i < pages; i++) {
      const birdeyeResponse = await fetch(
        `https://public-api.birdeye.so/defi/tokenlist?sort_by=${sortBy}&sort_type=${sortType}&offset=${
          offset + i * limit
        }&limit=${limit}`,
        {
          headers: {
            "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
          },
        }
      );
      const { data }: { data: BirdEyeTokenListResponse } =
        await birdeyeResponse.json();
      coins = coins.concat(data.tokens);
    }

    return NextResponse.json({
      status: 200,
      total: coins.length,
      coins,
    });
  }
}
