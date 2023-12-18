import { gql } from "@apollo/client";

export const ADD_WALLET = gql`
  mutation ADD_WALLET($address: String!, $keypairId: uuid!) {
    insert_wallets_one(object: { address: $address, keypairId: $keypairId }) {
      id
      address
    }
  }
`;
