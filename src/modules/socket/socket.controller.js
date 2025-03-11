import { Server } from "socket.io";
import { socketListener } from "./socket-handler/socket-listener.js";
import {
  socketIsAuthenticated,
  socketIsAuthorized,
} from "../../middleware/index.middlewares.js";
import { roles } from "../../common/index.common.js";

const setupSockets = (httpServer, app) => {
  //establish connection
  const io = new Server(httpServer, { cors: "*" });

  // inject io to req.app.locals.io
  app.locals.io = io;

  // Middleware for authentication and authorization
  io.use(socketIsAuthenticated()).use(
    socketIsAuthorized(roles.USER, roles.ADMIN)
  );

  //listen to event
  return io.on("connection", socketListener);
};

export default setupSockets;
