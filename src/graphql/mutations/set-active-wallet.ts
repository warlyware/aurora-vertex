import { gql } from "@apollo/client";

export const SET_ACTIVE_WALLET = gql`
  mutation SET_ACTIVE_WALLET($address: String!) {
    update_wallets(
      where: { address: { _eq: $address } }
      _set: { isActiveWallet: true }
    ) {
      returning {
        id
        address
        isActiveWallet
      }
    }
  }
`;
