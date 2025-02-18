import { gql } from "@apollo/client";

export const GET_BOTS_BY_USER_ID = gql`
query GET_BOTS_BY_USER_ID($userId: uuid) {
  bots(where: {ownerId: {_eq: $userId}}) {
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
        id
        createdAt
        updatedAt
      }
    }
  }
}`;
