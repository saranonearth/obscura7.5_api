const gql = require("graphql-tag");

module.exports = gql`
  type token {
    token: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    auth(token: String!): token!
    sendInvite(teamId: String!, playerId: String!): String!
  }
`;
