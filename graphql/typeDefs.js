const { gql } = require('graphql-tag');

module.exports = gql`
  type User {
    username: String!
    isFavored: Boolean!
    balance: Float!
  }

  type Transfer {
    from: String!
    to: String!
    amount: Float!
    date: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    transfers: [Transfer!]!
  }

  type Mutation {
    register(username: String!, password: String!, isFavored: Boolean): User!
    login(username: String!, password: String!): AuthPayload!
    transfer(from: String!, to: String!, amount: Float!): Transfer!
  }
`;
