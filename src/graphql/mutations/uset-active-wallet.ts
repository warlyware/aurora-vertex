import { gql } from "@apollo/client";

export const UNSET_ACTIVE_WALLET = gql`
  mutation UNSET_ACTIVE_WALLET($address: String!) {
    update_wallets(
      where: { address: { _eq: $address } }
      _set: { isActiveWallet: false }
    ) {
      returning {
        id
      }
    }
  }
`;
