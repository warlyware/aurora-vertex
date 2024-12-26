import { gql } from "@apollo/client";

export const GET_WALLET_KEYPAIR_BY_ADDRESS = gql`
  query GET_WALLET_KEYPAIR_BY_ADDRESS($address: String!) {
    wallets(where: { address: { _eq: $address } }) {
      keypair {
        id
        privateKey
        publicKey
      }
      id
    }
  }
`;
