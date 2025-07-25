import { gql } from "@apollo/client";

export const UPDATE_BOT_SETTINGS = gql`
  mutation UPDATE_BOT_SETTINGS($botId: uuid!, $botSettings: bots_set_input!) {
    update_bots_by_pk(pk_columns: {id: $botId}, _set: $botSettings) {
      id
      createdAt
      updatedAt
      ejectWallet {
        address
      }
      botWallet {
        wallet {
          address
        }
      }
    }
  }
`;
