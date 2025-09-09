import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUser(id: ID!): User!
    getAllUsers: [User!]!
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): User!
    updateUser(id: ID!, name: String, email: String, password: String): User!
    deleteUser(id: ID!): User!
  }
`;
