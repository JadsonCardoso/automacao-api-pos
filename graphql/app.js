const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { authMiddlewareGraphql } = require('./auth');

async function startServer() {
  const app = express();

  // ✅ 1. Middlewares globais
  app.use(cors());
  app.use(express.json()); // <-- ESTE É O MAIS IMPORTANTE

  // ✅ 2. Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // ✅ 3. Rota GraphQL com Apollo e middleware de autenticação
  app.use(
    '/graphql',
    authMiddlewareGraphql,
    expressMiddleware(server, {
      context: async ({ req }) => ({ user: req.user }),
    })
  );

  return app;
}

module.exports = startServer;



