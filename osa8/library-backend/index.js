require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const http = require("http");

const mongoose = require("mongoose");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/User");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRET || "NO_SECRET";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log("Error connecting mongoDB", err.message);
  });

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: "",
    }
  );

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const token = jwt.verify(auth.substring(7), JWT_SECRET);
        const user = await User.findById(token.id);
        return { user };
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {},
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app, path: "/" });
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Listening http://localhost:${PORT}`);
  });
})();
