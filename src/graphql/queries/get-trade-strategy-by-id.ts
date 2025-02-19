import { gql } from "@apollo/client";

export const GET_TRADE_STRATEGY_BY_ID = gql`
  query GET_TRADE_STRATEGY_BY_ID($id: uuid!) {
    tradeStrategies_by_pk(id: $id) {
      id
      name
      maxBuyAmount
      stopLossPercentage
      takeProfitPercentage
      shouldCopyBuys
      shouldCopySells
      shouldEjectOnBuy
      shouldEjectOnCurve
      shouldSellOnCurve
      priorityFee
      slippagePercentage
      intendedTradeRatio
    }
  }
`;
