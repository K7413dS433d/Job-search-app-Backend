import { Server } from "socket.io";
import {
  socketIsAuthenticated,
  socketIsAuthorized,
} from "../../middleware/index.middlewares.js";
import { roles } from "../../common/index.common.js";

const setupSockets = (httpServer) => {
  //establish connection
  const io = new Server(httpServer, { cors: "*" });

  // Middleware for authentication and authorization
  io.use(socketIsAuthenticated()).use(
    socketIsAuthorized(roles.USER, roles.ADMIN)
  );

  //listen to event
  return io;
};

export default setupSockets;
