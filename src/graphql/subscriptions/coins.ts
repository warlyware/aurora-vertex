import { gql } from "@apollo/client";

export const COINS = gql`
  subscription COINS {
    coins {
      id
      name
      createdAt
      address
      score
    }
  }
`;
