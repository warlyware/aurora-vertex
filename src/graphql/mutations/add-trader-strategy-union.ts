import { gql } from "@apollo/client";

export const ADD_TRADER_STRATEGY_UNION = gql`
  mutation ADD_TRADER_STRATEGY_UNION($traderStrategyUnion: traderStrategies_insert_input!) {
    insert_traderStrategies_one(object: $traderStrategyUnion) {
      id
    }
  }
`
