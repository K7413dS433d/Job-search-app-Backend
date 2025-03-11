import models from "./../../database/models/index.models.js";

export const getChat = async (req, res, next) => {
  const { authUser } = req;
  const { userId } = req.params;

  const chat = await models.Chat.find({
    $or: [
      { $and: [{ receiverId: userId }, { senderId: authUser.id }] },
      { $and: [{ receiverId: authUser.id }, { senderId: userId }] },
    ],
  }).select("messages");

  return res
    .status(200)
    .json({ success: true, message: "Successfully", data: chat });
};
