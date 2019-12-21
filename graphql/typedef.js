const gql = require("graphql-tag");

module.exports = gql`
  type token {
    token: String!
  }

  type Level {
    level: Int
  }

  type teamMember {
    player: Player
    solvedLevels: [Level]
    levelsSolved: Int!
  }
  type dInvitations {
    player: Player!
  }
  type Invitation {
    player: ID!
  }
  type curlevel {
    levelNo: Int
    level: ID
  }
  type Team {
    id: ID!
    teamName: String
    image: String
    curlevel: curlevel
    stream: String!
    answerset: String!
    members: [teamMember]
    teamAdmin: ID
    uniqueKey: String!
    invitations: [Invitation]
    bio: String
  }

  type Player {
    id: ID
    name: String
    gameName: String
    email: String!
    group: Team
    firstTime: Boolean
    image: String!
  }
  type Query {
    hello: String!
    getGamePlayer: Player!
    getGameTeam(teamId: ID!): Team!
    getParticularPlayer(playerId: String!): Player!
    getTeamInvitations: [dInvitations]!
  }

  type Mutation {
    auth(token: String!): token!
    createTeam(
      teamName: String!
      bio: String!
      image: String!
      uniqueKey: String!
    ): Team!
    sendInvite(teamId: String!): String!
    acceptInvite(playerId: String!, inviteId: String!): Team!
  }
`;
