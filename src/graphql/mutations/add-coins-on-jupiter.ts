import { gql } from "@apollo/client";

export const ADD_COINS_ON_JUPITER = gql`
  mutation ADD_COINS_ON_JUPITER($coins: [coinsOnJupiter_insert_input!]!) {
    insert_coinsOnJupiter(objects: $coins) {
      affected_rows
      returning {
        address
        id
        decimals
        name
        symbol
        imageUrl
      }
    }
  }
`;
