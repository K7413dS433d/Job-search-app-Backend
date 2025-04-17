import express from "express";
import bootstrap from "./src/app.controller.js";
import setupSockets from "./src/modules/socket/socket.controller.js";
import { socketListener } from "./src/modules/socket/socket-handler/socket-listener.js";
//cron jobs
import "./src/scheduler/cron_runner.js";

const app = express();
const port = +process.env.PORT || 3000;

//bootstrap calling
await bootstrap(express, app);

const httpServer = app.listen(port, () => {
  console.log("app is running on port", port);
});

//init socket
const io = setupSockets(httpServer);
io.on("connection", socketListener);
export const ioGetter = () => io;
