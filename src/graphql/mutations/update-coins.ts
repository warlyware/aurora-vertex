import { gql } from "@apollo/client";

export const UPDATE_COINS = gql`
  mutation UPDATE_COINS($coins: coins_set_input = {}, $addresses: [String!]!) {
    update_coins_many(
      updates: { where: { address: { _in: $addresses } }, _set: $coins }
    ) {
      affected_rows
      returning {
        id
        name
        address
      }
    }
  }
`;
