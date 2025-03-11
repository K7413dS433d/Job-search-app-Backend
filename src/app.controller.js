import cors from "cors";
import connectDB from "./database/connection.js";
import routers from "./modules/index.routers.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/graphql/graph.controller.js";
import { globalError, notFound, context, error } from "./utils/index.utils.js";

const bootstrap = async (express, app) => {
  //database connection
  await connectDB();

  //cors
  app.use(cors());

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
