const dotenv = require("dotenv");
dotenv.config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers");

const username = encodeURIComponent(process.env.DATABASE_USERNAME);
const password = encodeURIComponent(process.env.DATABASE_PASSWORD);
const db = encodeURIComponent(process.env.DATABASE_URL);

const MONGODB = `mongodb+srv://${username}:${password}@${db}/?retryWrites=true&w=majority`;

const PORT = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(async () => {
    console.log("MongoDB Connected");
    const { url } = await startStandaloneServer(server, {
      listen: { port: PORT },
    });

    return url;
  })
  .then((res) => {
    console.log(`🚀  Server ready at: ${PORT}`);
  });
