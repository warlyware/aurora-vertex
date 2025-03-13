import { gql } from "@apollo/client";
export const GET_BOT_BY_WALLET_ADDRESS = gql`
  query GET_BOT_BY_WALLET_ADDRESS($address: String!) {
    bots(where: { botWallet: { wallet: { address: { _eq: $address } } } }) {
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
          shouldAutoSell
          autoSellDelayInMs
          priorityFee
          slippagePercentage
          intendedTradeRatio
          id
          createdAt
          updatedAt
        }
      }
    }
  }
`;

