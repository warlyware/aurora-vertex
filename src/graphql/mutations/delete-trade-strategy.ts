import { gql } from "@apollo/client";

export const DELETE_TRADE_STRATEGY = gql`
  mutation DELETE_TRADE_STRATEGY($id: uuid!) {
    delete_traderStrategies_by_pk(id: $id) {
      id
    }
  }
`;
