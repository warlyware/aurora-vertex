import { gql } from "@apollo/client";

export const GET_WALLET_BY_ID = gql`
  query GET_WALLET_BY_ID($id: uuid!) {
    wallets_by_pk(id: $id) {
      address
      id
    }
  }
`;
