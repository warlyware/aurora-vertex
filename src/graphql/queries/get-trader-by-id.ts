import { gql } from "@apollo/client";

export const GET_TRADER_BY_ID = gql`
  query GET_TRADER_BY_ID($id: uuid!) {
    traders_by_pk(id: $id) {
      id
      name
      notes
      createdAt
      wallet {
        address
        id
      }
      updatedAt
    }
  }
`