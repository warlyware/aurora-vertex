import { gql } from "@apollo/client";

export const ADD_COINS = gql`
  mutation ADD_COINS($coins: [coins_insert_input!]!) {
    insert_coins(objects: $coins) {
      affected_rows
      returning {
        name
        id
        address
      }
    }
  }
`;
