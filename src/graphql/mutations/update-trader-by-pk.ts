import { gql } from "@apollo/client";

export const UPDATE_TRADER_BY_PK = gql`
  mutation UPDATE_TRADER_BY_PK($id: uuid!, $trader: traders_set_input!) {
    update_traders_by_pk(pk_columns: { id: $id }, _set: $trader) {
      id
      name
      wallet {
        id
        address
      }
    }
  }
`;