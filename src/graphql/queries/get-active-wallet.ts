import { gql } from "@apollo/client";

export const GET_ACTIVE_WALLET = gql`
  query GET_ACTIVE_WALLET($userId: uuid = "") {
    wallets(
      where: { isActiveWallet: { _eq: true }, userId: { _eq: $userId } }
    ) {
      address
      id
    }
  }
`;
