const user = `
  type Query {
    getUser(id: ID!): User!
    getAllUsers: [User!]!
  }
`;

export default user;