import { gql } from "@apollo/client";

export const GET_COINS_ON_JUPITER = gql`
  query GET_COINS_ON_JUPITER {
    coinsOnJupiter(order_by: { createdAt: desc }) {
      id
      address
      decimals
      name
      symbol
      imageUrl
      createdAt
      updatedAt
      chainId
    }
  }
`;
