import { sendMessage } from "../service/chat/chat.service.js";

//socket listener
export const socketListener = async (socket) => {
  try {
    socket.on("send_message", sendMessage(socket));

    //!events here
  } catch (error) {
    console.error("Socket error:", error.message);
    socket.emit("socket_error", {
      success: false,
      status: error.cause,
      message: error.message,
    });
  }

  return socket;
};
