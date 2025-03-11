import joi from "joi";
import * as common from "../../common/index.common.js";

//add job
export const addJob = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi
      .string()
      .valid(...Object.values(common.jobLocation))
      .required(),
    workingTime: joi
      .string()
      .valid(...Object.values(common.workingTime))
      .required(),
    experienceLevel: joi
      .string()
      .valid(...Object.values(common.experienceLevel))
      .required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string()).required(),
    softSkills: joi.array().items(joi.string()).required(),
    companyId: common.objectIdType.required(),
  })
  .required();

//update job
export const updateJob = joi
  .object({
    jobId: common.objectIdType.required(),
    jobTitle: joi.string(),
    jobLocation: joi.string().valid(...Object.values(common.jobLocation)),
    workingTime: joi.string().valid(...Object.values(common.workingTime)),
    experienceLevel: joi
      .string()
      .valid(...Object.values(common.experienceLevel)),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  })
  .or(
    "jobTitle",
    "jobLocation",
    "workingTime",
    "experienceLevel",
    "jobDescription",
    "technicalSkills",
    "softSkills"
  )
  .required();

//delete job
export const deleteJob = joi
  .object({
    jobId: common.objectIdType.required(),
  })
  .required();

// search job
export const searchJob = joi
  .object({
    workingTime: joi.string().valid(...Object.values(common.workingTime)),
    jobLocation: joi.string().valid(...Object.values(common.jobLocation)),
    seniorityLevel: joi
      .string()
      .valid(...Object.values(common.experienceLevel)),
    jobTitle: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    limit: joi.number().integer().min(1).default(10),
    page: joi.number().integer().min(1).default(1),
  })
  .required();

//get all applications
export const getAllApplications = joi
  .object({
    jobId: common.objectIdType.required(),
    page: joi.number().min(0),
    limit: joi.number().min(0),
  })
  .required();

//get company job
export const getCompanyJob = joi
  .object({
    companyId: common.objectIdType.required(),
    jobId: common.objectIdType,
    page: joi.number().min(0),
    limit: joi.number().min(0),
  })
  .required();

//apply for job
export const applyForJob = joi
  .object({
    jobId: common.objectIdType.required(),
    file: common.fileValidatorType(common.fileInputFields.cv).required(),
  })
  .required();

//accept application
export const acceptApplication = joi
  .object({
    applicationId: common.objectIdType.required(),
    acceptance: joi.boolean().required(),
  })
  .required();

//export
export const exportApplications = joi
  .object({
    companyId: common.objectIdType.required(),
    createdAt: joi.date().required(),
  })
  .required();
