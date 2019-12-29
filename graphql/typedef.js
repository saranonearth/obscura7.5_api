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
  type onboard {
    player: Player!
    token: String
  }
  type GameLevel {
    rLevelNo: Int
    temaLevelNo: Int
    level: ID
  }
  type LevelData {
    id: ID!
    data: String!
    rlevelNo: Int
  }
  type Team {
    id: ID!
    teamName: String
    image: String
    levelsSolved: Int
    curlevel: curlevel
    stream: String!
    answerset: String!
    members: [teamMember]
    teamAdmin: ID
    uniqueKey: String!
    invitations: [Invitation]
    bio: String
  }
  type TeamLevel {
    levelNo: Int
    level: ID
  }

  type Player {
    id: ID!
    name: String
    gameName: String
    uniqueKey: String
    email: String
    group: ID
    firstTime: Boolean
    image: String
  }
  type Teams {
    teamCount: Int
    teams: [Team]!
  }
  type Query {
    hello: String!
    getGamePlayer: Player!
    getGameTeam(teamId: ID!): Team!
    getParticularPlayer(playerId: String!): Player!
    getTeamInvitations: [dInvitations]!
    getAllTeams(skip: Int): Teams!
    getLevel(levelId: String!): LevelData!
    getTeamLevels: [TeamLevel]!
  }

  type Mutation {
    auth(token: String!): token!
    createTeam(
      teamName: String!
      bio: String!
      image: String!
      uniqueKey: String!
    ): Team!
    onBoard(gameName: String!, image: String!, uniqueKey: String!): onboard!
    sendInvite(teamId: String!): String!
    acceptInvite(playerId: String!, inviteId: String!): Team!
    checkAnswer(answer: String!, levelNo: Int!): Boolean!
  }
`;
