const gql = require("graphql-tag");

module.exports = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    auth(token: String!): String!
  }
`;
