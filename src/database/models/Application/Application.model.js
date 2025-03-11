import { model, Schema, Types } from "mongoose";
import { applicationStatus } from "../../../common/index.common.js";

// schema
const ApplicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    userCV: {
      secure_url: {
        type: String,
        required: true,
      },

      public_id: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: Object.values(applicationStatus),
      default: applicationStatus.PENDING,
    },
  },
  { timestamps: true }
);

// model
const Application = model("Application", ApplicationSchema);

export default Application;
