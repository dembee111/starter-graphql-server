const express = require("express");
const { ApolloServer } = require("apollo-server-express");
// const { makeExecutableSchema } = require("graphql-tools");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

// express server
const app = express();

const database = async () => {
  try {
    const success = await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection Error", error);
  }
};

// execute database connectiOn
database();

// typeDefs
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs"))
);
// // resolvers
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

// applyMiddleware method connects Apolloserver to a specific HTTP framework ie: express

let apolloServer = null;
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();

// server
const httpserver = http.createServer(app);

// rest endpoint
app.get("/rest", function (req, res) {
  res.json({
    data: "you hit rest endpoint",
  });
});
// port
app.listen(process.env.PORT, () => {
  console.log(`server is ready at localhost: ${process.env.PORT}`);
  console.log(
    `graphql server is ready at localhost: ${process.env.PORT}${apolloServer.graphqlPath}`
  );
});
