import { gql } from "@apollo/client";

export const GET_COIN_BY_ADDRESS = gql`
  query GET_COIN_BY_ADDRESS($address: String!) {
    coins(where: { address: { _eq: $address } }) {
      id
      address
      decimals
      imageUrl
      lastTradeUnixTime
      createdAt
      liquidity
      marketCap
      metadata {
        description
        id
        imageUrl
        isMutable
        isSigner
        isWritable
        key
        offchainMetadataUrl
        sellerFeeBasisPoints
        tokenStandard
        usesRemaining
        usesTotal
      }
      name
      score
      symbol
      updatedAt
      v24hrChangePercent
      v24hrUSD
    }
  }
`;
