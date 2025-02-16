import { gql } from "@apollo/client";

export const GET_BOT_BY_ID = gql`
query GET_BOT_BY_ID($botId: uuid!) {
  bots_by_pk(id: $botId) {
    id
    name
    createdAt
    updatedAt
    ejectWallet {
      id
      address  
    }
    botWallet {
      wallet {
        keypair {
          publicKey
        }
      }
    }
    user {
      id
    }
  }
}`;
