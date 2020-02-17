const playerResolver = require("./playerResolver");
const {
  withFilter
} = require("apollo-server");
module.exports = {
  Mutation: {
    ...playerResolver.Mutation
  },
  Query: {
    ...playerResolver.Query
  },
  Subscription: {
    pushInvite: {
      subscribe: withFilter(
        (_, __, {
          pubsub
        }) => pubsub.asyncIterator("NEW_INVITE"),
        (payload, variables) => {
          return payload.pushInvite.teamId === variables.teamId;
        }
      )
    },
    pushTeam: {
      subscribe: withFilter(
        (_, __, {
          pubsub
        }) => pubsub.asyncIterator("PUSH_TEAM"),
        (payload, variables) => {
          return payload.pushTeam.playerId === variables.playerId;
        }
      )
    }
  }
};