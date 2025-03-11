import express from "express";
import bootstrap from "./src/app.controller.js";
import setupSockets from "./src/modules/socket/socket.controller.js";
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
setupSockets(httpServer, app);
