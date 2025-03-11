import { model, Schema, Types } from "mongoose";

// schema
const chatSchema = new Schema({
  senderId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiverId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },

  messages: [
    {
      message: {
        type: String,
        required: true,
      },
      senderId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
});

// model

const Chat = model("Chat", chatSchema);

export default Chat;
