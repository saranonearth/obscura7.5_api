const playerResolver = require("./playerResolver");

module.exports = {
  Mutation: {
    ...playerResolver.Mutation
  },
  Query: {
    ...playerResolver.Query
  }
};
