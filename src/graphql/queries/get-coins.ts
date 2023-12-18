import { gql } from "@apollo/client";

export const GET_COINS = gql`
  query GET_COINS {
    coins {
      id
      name
      address
      createdAt
    }
  }
`;
