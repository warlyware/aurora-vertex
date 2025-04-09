import { gql } from "@apollo/client"

export const GET_TRADERS = gql`
  query GET_TRADERS {
    traders {
      id
      name
      createdAt
      wallet { 
        id
        address
      }
      description
    }
  }
`;