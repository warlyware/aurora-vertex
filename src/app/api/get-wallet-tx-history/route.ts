import { NextRequest, NextResponse } from "next/server";

type GetWalletTxHistoryInput = {
  address: string;
};

export type BirdEyeTxHistoryResponse = {
  solana: {
    txHash: string;
    blockNumber: number;
    blockTime: string;
    status: boolean;
    from: string;
    to: string;
    fee: number;
    mainAction: string;
    balanceChange: {
      amount: number;
      symbol: string;
      name: string;
      decimals: number;
      address: string;
      logoURI: string;
    }[];
    contractLabel: {
      address: string;
      name: string;
      metadata: {
        icon: string;
      };
    };
  }[];
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

  const body: GetWalletTxHistoryInput = await req?.json();

  const birdeyeResponse = await fetch(
    `https://public-api.birdeye.so/v1/wallet/tx_list?wallet=${body.address}`,
    {
      headers: {
        "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
        "x-chain": "solana",
      },
    }
  );

  const { data }: { data: BirdEyeTxHistoryResponse } =
    await birdeyeResponse.json();

  return NextResponse.json({
    status: 200,
    ...data?.solana,
  });
}
