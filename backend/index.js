import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
// import multer from "multer";
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";
import { ApolloServer } from "@apollo/server";
// import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload";
import graphqlUploadExpress from "graphql-upload/GraphQLUpload.mjs";
import { expressMiddleware } from "@apollo/server/express4";
// import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import dotenv from "dotenv";
import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";
import { connectDB } from "./db/connectDB.js";
import passport from "passport";
import session from "express-session";
import ConnectMongo from "connect-mongodb-session";
import { configurePassport } from "./passport/passport.config.js";

// import resolvers from "./resolvers/resolvers.js";

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);
dotenv.config();
configurePassport();
const MongoDBStore = ConnectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //this option specifies whether to save the session to the store on every request
    saveUninitialized: false, //this option specifies whether to save the uninitialised sessions
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //this option prevents cross-site scripting attacks
    },
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  // uploads: false, // Disable built-in upload handling
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  // context: async ({ req, res }) => buildContext({ req, res, User }),
});

//wait for server to start

await server.start();

//set up our express to handle Cors, body parsing,
//and our expressmiddleware function
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true, //this is to allow us send cookie
  }),
  express.json(),
  express.urlencoded({ extended: true }),
  // graphqlUploadExpress({ maxFieldSize: 10000, maxFileSize: 10 }), //Enable file uploads
  //express middleware accepts the same args as apollo server instance
  //and optional configuration options
  // multer({
  //   storage: multer.memoryStorage(),
  // }).any(),

  expressMiddleware(server, {
    context: async ({ req, res }) =>
      buildContext({
        req,
        res,
      }),
  })
);

//npm run build will build your frontend app, and it will be the optimised version of your
//app
//render.com=> backend and frontend under same domain localhost:4000

app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
//modified server startup
const PORT = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
await connectDB();
console.log(`🚀server ready at http://localhost:4000/graphql`);
