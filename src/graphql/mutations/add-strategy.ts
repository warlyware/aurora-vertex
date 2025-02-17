import { gql } from "@apollo/client";

export const ADD_STRATEGY = gql`
  mutation ADD_STRATEGY($strategy: tradeStrategies_insert_input!) {
    insert_tradeStrategies_one(object: $strategy) {
      id
    }
  }
`
