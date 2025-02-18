import { client } from "@/client/backend-client";
import { ADD_STRATEGY } from "@/graphql/mutations/add-strategy";
import { ADD_TRADER_STRATEGY_UNION } from "@/graphql/mutations/add-trader-strategy-union";
import { DELETE_TRADE_STRATEGY } from "@/graphql/mutations/delete-trade-strategy";
import { DELETE_TRADER_STRATEGY_UNION } from "@/graphql/mutations/delete-trader-strategy-union";
import { UPDATE_BOT_SETTINGS } from "@/graphql/mutations/update-bot-stettings";
import { GET_BOT_BY_ID } from "@/graphql/queries/get-bot-by-id";
import { GET_TRADER_BY_ID } from "@/graphql/queries/get-trader-by-id";
import { GET_TRADER_STRATEGY_UNIONS_BY_BOT_ID } from "@/graphql/queries/get-trader-strategy-unions-by-bot-id";
import { NextRequest, NextResponse } from "next/server";


const IS_ONLY_ONE_STRATEGY_PER_BOT = true;

export async function POST(req: NextRequest) {
  const { name,
    traderId,
    maxBuyAmount,
    stopLossPercentage,
    takeProfitPercentage,
    shouldCopyBuys,
    shouldCopySells,
    shouldEjectOnBuy,
    priorityFee,
    botId,
  }: {
    name: string,
    traderId: string,
    maxBuyAmount: number,
    stopLossPercentage: number,
    takeProfitPercentage: number,
    shouldCopyBuys: boolean,
    shouldCopySells: boolean,
    shouldEjectOnBuy: boolean,
    priorityFee: number,
    botId: string,
  } = await req?.json();

  const { traders_by_pk: trader }: {
    traders_by_pk: {
      id: string;
      name: string;
      notes: string;
      wallet: {
        id: string;
        address: string;
      }
    }
  } = await client.request({
    document: GET_TRADER_BY_ID,
    variables: { id: traderId },
  });

  if (!trader) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Trader not found",
      },
    });
  }

  const { traderStrategies }: {
    traderStrategies: {
      id: string;
    }[];
  } = await client.request({
    document: GET_TRADER_STRATEGY_UNIONS_BY_BOT_ID,
    variables: {
      botId,
    },
  });

  console.log({ traderStrategies });

  if (IS_ONLY_ONE_STRATEGY_PER_BOT && traderStrategies.length > 0) {
    const { bots_by_pk: bot }: {
      bots_by_pk: {
        id: string;
        activeTraderStrategyUnionId?: string;
      }
    } = await client.request({
      document: GET_BOT_BY_ID,
      variables: { botId },
    });

    if (!bot) {
      return NextResponse.json({
        status: 400,
        body: {
          error: "Bot not found",
        },
      });
    }

    if (bot?.activeTraderStrategyUnionId) {
      // remove the old strategy
      await client.request({
        document: UPDATE_BOT_SETTINGS,
        variables: {
          botId,
          botSettings: {
            activeTraderStrategyUnionId: null,
          },
        },
      });
    }

    console.log({ bot });

    await client.request({
      document: DELETE_TRADER_STRATEGY_UNION,
      variables: {
        id: traderStrategies[0].id,
      },
    });

    await client.request({
      document: DELETE_TRADE_STRATEGY,
      variables: {
        id: traderStrategies[0].id,
      },
    });
  }

  const { insert_tradeStrategies_one }: {
    insert_tradeStrategies_one: {
      id: string;
    }
  } = await client.request({
    document: ADD_STRATEGY,
    variables: {
      strategy: {
        name,
        maxBuyAmount,
        stopLossPercentage,
        takeProfitPercentage,
        shouldCopyBuys,
        shouldCopySells,
        shouldEjectOnBuy,
        priorityFee,
      },
    },
  });

  if (!insert_tradeStrategies_one?.id) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Failed to add strategy",
      },
    });
  }

  const { insert_traderStrategies_one }: {
    insert_traderStrategies_one: {
      id: string;
    }
  } = await client.request({
    document: ADD_TRADER_STRATEGY_UNION,
    variables: {
      traderStrategyUnion: {
        traderId,
        tradeStrategyId: insert_tradeStrategies_one.id,
        botId: botId,
      },
    },
  });

  if (!insert_traderStrategies_one?.id) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Failed to add trader strategy union",
      },
    });
  }

  const { update_bots_by_pk }: {
    update_bots_by_pk: {
      id: string;
    }
  } = await client.request({
    document: UPDATE_BOT_SETTINGS,
    variables: {
      botId,
      botSettings: {
        activeTraderStrategyId: insert_traderStrategies_one.id,
      },
    },
  });

  if (!insert_traderStrategies_one?.id) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Failed to add trader strategy union",
      },
    });
  }

  return NextResponse.json({
    status: 200,
    body: {
      strategy: insert_tradeStrategies_one,
    },
  });
}
