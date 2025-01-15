import { gql } from "@apollo/client";

export const GET_TRADER_BY_ADDRESS = gql`
  query GET_TRADER_BY_ADDRESS($address: String!) {
    traders(where: {wallet: {address: {_eq: $address}}}) {
      id
      name
      createdAt
    }
  }
`