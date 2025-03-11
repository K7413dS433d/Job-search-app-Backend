import models from "./../../../../database/models/index.models.js";

export const sendMessage = (socket, io) => {
  return async ({ message, to }) => {
    const { authUser } = socket;
    const senderId = authUser.id;
    const receiverId = to;

    // Try to update the conversation
    const updatedChat = await models.Chat.findOneAndUpdate(
      {
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      {
        $push: { messages: { message, senderId } },
      },
      { new: true } // Return updated chat
    );

    if (updatedChat) return socket.emit("message_sent", "success");

    // If no conversation exists, check if the user is an HR
    const isHR = await models.Company.findOne({ HRs: { $in: [senderId] } });

    if (isHR) {
      await models.Chat.create({
        senderId,
        receiverId,
        messages: [{ message, senderId }],
      });

      return socket.emit("message_sent", "success");
    }

    return socket.emit("socket_error", "Conversation not allowed");
  };
};
