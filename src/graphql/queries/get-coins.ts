import { gql } from "@apollo/client";

export const GET_COINS = gql`
  query GET_COINS {
    coins {
      address
      createdAt
      decimals
      id
      imageUrl
      lastTradeUnixTime
      liquidity
      marketCap
      name
      score
      symbol
      updatedAt
      v24hrChangePercent
      v24hrUSD
    }
  }
`;
