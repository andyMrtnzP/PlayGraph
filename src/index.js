import { GraphQLServer } from 'graphql-yoga';
import { success } from './utils';
import express, { Router } from 'express'
import db from './db';
import Query from './graphql/Query';
import Mutation from './graphql/Mutation';
import Album from './graphql/resolvers/Album';
import Artist from './graphql/resolvers/Artist';
import Song from './graphql/resolvers/Song';
import path from 'path'

const STATIC_DIR = path.join(__dirname, '..', 'public');
const MUSIC_DIR = path.join(__dirname, '..', 'music');
const PORT = process.env.PROCESS || 4000;
const opts = {
  port: PORT,
  endpoint: "/graphql"
};

const server = new GraphQLServer({
  typeDefs: `${__dirname}/graphql/schema.graphql`,
  resolvers: {
    Query,
    Mutation,
    Artist,
    Album,
    Song
  },
  context: {
    db
  }
});

const router = Router();
router.get("/app", (req, res) => {
  res.sendFile('index.html', { root: STATIC_DIR });
})

server.start(opts, (params) => {
  success(`Server started 🚀`)
  success(`    Running playground on http://localhost:${params.port}${params.playground}`)
  success(`    Requests on http://localhost:${params.port}${params.endpoint}`)
});

server.express.use(router)
server.express.use(express.static(STATIC_DIR))
server.express.use(express.static(MUSIC_DIR))
