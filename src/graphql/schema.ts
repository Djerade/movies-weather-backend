import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    city: String!
  }

  type Query {
    getUser(id: ID!): User!
    getAllUsers: [User!]!
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): User!
  }
`;
