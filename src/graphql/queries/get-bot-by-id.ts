import { gql } from "@apollo/client";

export const GET_BOT_BY_ID = gql`
query GET_BOT_BY_ID($botId: uuid!) {
  bots_by_pk(id: $botId) {
    id
    name
    createdAt
    updatedAt
    ejectWallet {
      id
      address  
    }
    botWallet {
      wallet {
        keypair {
          publicKey
        }
      }
    }
    user {
      id
    }
      
    activeTraderStrategyId
    activeTraderStrategyUnion {
      id      
      traderId
      tradeStrategyId
      trader {
        id
        name
        wallet {
          id
          address
        }
      }
      strategy {
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
        id
        createdAt
        updatedAt
      }
    }
  }
}`;
