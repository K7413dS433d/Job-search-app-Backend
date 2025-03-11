import { model, Schema, Types } from "mongoose";
import { defaultLogo, employerRange } from "../../../common/index.common.js";

//schema
const companySchema = new Schema(
  {
    companyName: { type: String, unique: true, required: true },

    description: { type: String, required: true },

    industry: { type: String, required: true },

    address: { type: String, required: true },

    numberOfEmployees: {
      type: String,
      required: true,
      enum: Object.values(employerRange),
    },

    companyEmail: { type: String, unique: true, required: true },

    createdBy: { type: Types.ObjectId, required: true, ref: "User" },

    logo: {
      secure_url: { type: String, default: defaultLogo.SECURE_URL },
      public_id: { type: String, default: defaultLogo.PUBLIC_ID },
    },

    coverPic: {
      secure_url: {
        type: String,
        required: true,
        default: defaultLogo.SECURE_URL,
      },
      public_id: {
        type: String,
        required: true,
        default: defaultLogo.PUBLIC_ID,
      },
    },

    HRs: [{ type: Types.ObjectId, ref: "User" }],

    bannedAt: { type: Date },

    deletedAt: { type: Date },

    legalAttachment: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },

    approvedByAdmin: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Add a virtual field related jobs
companySchema.virtual("relatedJobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});

//model
const Company = model("Company", companySchema);

export default Company;
