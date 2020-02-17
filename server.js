const { ApolloServer, PubSub } = require("apollo-server");
require("dotenv").config();
const typeDefs = require("./graphql/typedef");
const mongoose = require("mongoose");
const resolvers = require("./graphql/resolvers");
const checkAuth = require("./graphql/util/checkAuth");
const PORT = 4000 || process.env.PORT;

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
    pubsub
  })
});

mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Database Connected");
    server
      .listen({
        port: PORT
      })
      .then(res => console.log(`Server running at ${res.url}`))
      .catch(err => console.log("Database connection err", err));
  });
