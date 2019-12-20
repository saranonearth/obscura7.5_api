const gql = require("graphql-tag");

module.exports = gql`
  type token {
    token: String!
  }

  type Level {
    level: Int
  }

  type teamMember {
    player: ID!
    solvedLevels: [Level]!
    levelsSolved: Int!
  }

  type Invitation {
    player: ID!
  }

  type Team {
    teamName: String!
    image: String!
    curlevel: Int!
    stream: String!
    answerset: String!
    members: [teamMember]!
    teamAdmin: ID!
    uniqueKey: String!
    invitations: [Invitation]!
    bio: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    auth(token: String!): token!
    createTeam(
      teamName: String!
      bio: String!
      image: String!
      uniqueKey: String!
    ): Team!
    # sendInvite(teamId: String!, playerId: String!): String!
  }
`;
