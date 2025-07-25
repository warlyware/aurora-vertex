import { gql } from "@apollo/client";

export const GET_TRADER_STRATEGY_UNIONS_BY_BOT_ID = gql`
  query GET_TRADER_STRATEGY_UNIONS_BY_BOT_ID($botId: uuid!) {
    traderStrategies(where: { botId: { _eq: $botId } }) {
      id
      traderId
      tradeStrategyId
      strategy {
        maxBuyAmount
        stopLossPercentage
        takeProfitPercentage
        shouldCopyBuys
        shouldCopySells
        shouldEjectOnBuy
        shouldEjectOnCurve
        shouldSellOnCurve
        priorityFee
        intendedTradeRatio
        slippagePercentage
        name
        id
        createdAt
        updatedAt
      }
    }
  }
`
