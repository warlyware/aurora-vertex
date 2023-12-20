import { gql } from "@apollo/client";

export const GET_WALLETS_BY_USER_ID = gql`
  query GET_WALLETS_BY_USER_ID($userId: uuid!) {
    wallets(where: { userId: { _eq: $userId } }) {
      id
      address
      isActiveWallet
    }
  }
`;
