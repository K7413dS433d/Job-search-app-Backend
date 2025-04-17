import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./database/connection.js";
import routers from "./modules/index.routers.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/graphql/graph.controller.js";
import { globalError, notFound, context, error } from "./utils/index.utils.js";

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, //default 1 min
  limit: 6, //default 5
});

const bootstrap = async (express, app) => {
  //database connection
  await connectDB();

  //rate limit
  app.use(limiter);

  //cors
  app.use(cors());

  //helmet
  app.use(helmet());

  //body parser
  app.use(express.json());

  //auth
  app.use("/auth", routers.authRouter);

  //account
  app.use("/user", routers.userRouter);

  //company
  app.use("/company", routers.companyRouter);

  //job
  app.use("/job", routers.jobRouter);

  //chat
  app.use("/chat", routers.chatRouter);

  //admin
  app.all(
    "/graphQl/admin",
    createHandler({
      schema,
      context: context,
      formatError: error,
    })
  );

  //not found path
  app.all("*", notFound);

  //global error handling
  app.use(globalError);
};

export default bootstrap;
