import { gql } from "@apollo/client";

export const ADD_TRADER = gql`
  mutation ADD_TRADER($trader: traders_insert_input!) {
    insert_traders_one(object: $trader) {
      wallet {
        id
        address
      }
      id
      name
    }
  }
`;
