import { gql } from "@apollo/client";

export const DELETE_TRADER_STRATEGY_UNION = gql`
  mutation DeleteTraderStrategyUnion($id: uuid!) {
    delete_traderStrategies_by_pk(id: $id) {
      id
    }
  }
`;