import { model, Schema, Types } from "mongoose";
import {
  jobLocation,
  experienceLevel,
  workingTime,
} from "./../../../common/index.common.js";

//schema
const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },

    jobLocation: {
      type: String,
      enum: Object.values(jobLocation),
      required: true,
    },

    workingTime: {
      type: String,
      enum: Object.values(workingTime),
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: Object.values(experienceLevel),
      required: true,
    },

    jobDescription: { type: String, required: true },

    technicalSkills: { type: [String], required: true },

    softSkills: { type: [String] },

    addedBy: { type: Types.ObjectId, ref: "User", required: true },

    updatedBy: { type: Types.ObjectId, ref: "User" },

    closed: { type: Boolean, default: false },

    companyId: { type: Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Add a virtual field related applications
jobSchema.virtual("relatedApplications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});

// model
const Job = model("Job", jobSchema);

export default Job;
