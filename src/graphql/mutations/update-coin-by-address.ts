import { gql } from "@apollo/client";

export const UPDATE_COIN_BY_ADDRESS = gql`
  mutation UPDATE_COIN_BY_ADDRESS($address: String!, $coin: coins_set_input!) {
    update_coins(where: { address: { _eq: $address } }, _set: $coin) {
      affected_rows
      returning {
        id
        address
        name
      }
    }
  }
`;
