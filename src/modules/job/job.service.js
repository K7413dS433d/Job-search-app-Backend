import fs from "node:fs";
import models from "./../../database/models/index.models.js";
import * as utils from "./../../utils/index.utils.js";
import { ioGetter } from "../../../index.js";

//add job
export const addJob = async (req, res, next) => {
  const { authUser } = req;
  const { companyId } = req.body;
  //check company exist
  const companyExist = await models.Company.findById(companyId);
  if (!companyExist)
    return next(new Error("Company not found", { cause: 404 }));

  //check company is approved or no
  if (!companyExist.approvedByAdmin)
    return next(new Error("Company is not approved"), { cause: 401 });

  //check if hr or company owner
  const isHr = companyExist.HRs.includes(authUser.id);
  const isCompanyOwner = companyExist.createdBy === authUser.id;

  if (!isHr && !isCompanyOwner)
    return next(
      new Error("Only Company owner or hr can add this job", { cause: 401 })
    );

  //create job
  const newJob = await models.Job.create({
    ...req.body,
    companyId: companyExist.id,
    addedBy: authUser.id,
  });

  return res.status(201).json({
    success: true,
    message: "Job created successfully",
    data: newJob,
  });
};

//update job
export const updateJob = async (req, res, next) => {
  const { authUser } = req;
  const { jobId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    experienceLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  //check job exist
  const jobExist = await models.Job.findById(jobId);
  if (!jobExist) return next(new Error("Job not found", { cause: 404 }));

  const companyExist = await models.Company.findById(jobExist.companyId);
  if (!companyExist)
    return next(
      new Error("Company  related to this job not found", { cause: 404 })
    );

  const isCompanyOwner = companyExist.createdBy.toString() == authUser.id;
  const isJobOwner = jobExist.addedBy.toString() == authUser.id;

  if (!isCompanyOwner && !isJobOwner)
    return next(
      new Error("Unauthorized job or company owners only can edit", {
        cause: 401,
      })
    );

  if (jobTitle) jobExist.jobTitle = jobTitle;
  if (jobLocation) jobExist.jobLocation = jobLocation;
  if (workingTime) jobExist.workingTime = workingTime;
  if (experienceLevel) jobExist.experienceLevel = experienceLevel;
  if (jobDescription) jobExist.jobDescription = jobDescription;
  if (technicalSkills) jobExist.technicalSkills = technicalSkills;
  if (softSkills) jobExist.softSkills = softSkills;

  //who did last update
  jobExist.updatedBy = authUser.id;

  //save job
  await jobExist.save();

  return res.status(200).json({
    success: true,
    message: "Job updated successfully",
    data: jobExist,
  });
};

//delete job
export const deleteJob = async (req, res, next) => {
  const { authUser } = req;
  const { jobId } = req.params;

  //check job exist
  const jobExist = await models.Job.findById(jobId);
  if (!jobExist) return next(new Error("Job not found", { cause: 404 }));

  const companyExist = await models.Company.findById(jobExist.companyId);
  if (!companyExist)
    return next(
      new Error("Company related to this job not found", { cause: 404 })
    );

  //check if hr or company owner
  const isHr = companyExist.HRs.includes(authUser.id);

  if (!isHr)
    return next(
      new Error("Unauthorized, only HR can delete this job", {
        cause: 401,
      })
    );

  //delete job
  await jobExist.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
};

// get all company jobs
export const getCompanyJob = async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const { page = 0, limit = 4 } = req.query;

  //options
  const skip = (page - 1 < 0 ? 0 : page - 1) * limit || 0;
  const query = jobId ? { _id: jobId } : {};

  const result = await models.Company.findById(companyId).populate({
    path: "relatedJobs",
    match: query,
    options: { sort: { createdAt: 1 }, skip, limit },
  });

  if (!result) return next(new Error("Company not exist", { cause: 404 }));

  res.status(200).json({
    success: true,
    message: "Successfully",
    data: { jobs: result.relatedJobs },
  });
};

//search for job
export const searchJob = async (req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
    limit = 10,
    page = 1,
  } = req.query;

  let options = {};

  if (workingTime) options.workingTime = { $regex: workingTime, $options: "i" };
  if (jobLocation) options.jobLocation = { $regex: jobLocation, $options: "i" };
  if (seniorityLevel)
    options.experienceLevel = { $regex: seniorityLevel, $options: "i" };
  if (jobTitle) options.jobTitle = { $regex: jobTitle, $options: "i" };
  if (technicalSkills)
    options.technicalSkills = {
      $in: technicalSkills.split(",").map((skill) => new RegExp(skill, "i")),
    };

  const jobsExist = await models.Job.find(options)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  return res.status(200).json({
    success: true,
    message: "Successfully",
    data: jobsExist,
  });
};

//get all company applications
export const getAllApplications = async (req, res, next) => {
  const { authUser } = req;
  const { jobId } = req.params;
  const { page = 0, limit = 4 } = req.query;

  const skip = (page - 1 < 0 ? 0 : page - 1) * limit || 0;

  //check job exist
  const jobExist = await models.Job.findById(jobId)
    .populate({
      path: "relatedApplications",
      options: { sort: { createdAt: 1 }, skip, limit },
    })
    .populate({ path: "companyId", select: "createdBy HRs" });

  if (!jobExist) return next(new Error("Job not found", { cause: 404 }));

  const isHr = jobExist.companyId.HRs.includes(authUser.id);
  const isCompanyOwner = jobExist.companyId.createdBy.toString() != authUser.id;

  if (!isHr && !isCompanyOwner)
    return next(
      new Error("Allowed only for Hr and Company owner", { cause: 401 })
    );

  // get total count
  const totalApplications = await models.Application.countDocuments({ jobId });
  const totalPages = Math.ceil(totalApplications / limit);

  return res.status(200).json({
    success: true,
    message: "Successfully",
    data: {
      totalCount: totalApplications,
      totalPages: totalPages,
      applications: jobExist.relatedApplications,
    },
  });
};

//apply for job
export const applyForJob = async (req, res, next) => {
  const { id: userId } = req.authUser;
  const { jobId } = req.params;

  //check job is exist
  const job = await models.Job.findById(jobId).populate({
    path: "companyId",
    select: "HRs",
  });

  if (!job) return next(new Error("Job not found", { cause: 404 }));

  if (job.closed)
    return next(new Error("Application already closed", { cause: 400 }));

  //check if applied before
  const isApplied = await models.Application.findOne({ jobId: job.id, userId });

  if (isApplied)
    return next(new Error("You Applied to this job before", { cause: 409 }));

  //resolve path
  const folder = utils.pathResolver({
    path: `users/${userId}/jobApplications/${jobId}`,
  });

  //upload file
  const cv = await utils.uploadFile({
    req,
    options: { folder, fileName: "user_cv" },
  });

  //create new application
  const newApplication = new models.Application({
    userId,
    jobId,
    userCV: cv,
  });

  //save application
  await newApplication.save();

  //send notification
  const companyHRs = job.companyId.HRs.map((hr) => hr.toString());
  ioGetter()
    .to(companyHRs)
    .emit(
      "application_submitted",
      `${req.authUser.username} submit ${job.jobTitle} application`
    );

  return res
    .status(200)
    .json({ success: true, message: "Application sent successfully" });
};

//accept applications
export const acceptApplication = async (req, res, next) => {
  const { acceptance } = req.query;
  const { applicationId } = req.params;

  const applicationExist = await models.Application.findById(
    applicationId
  ).populate([
    { path: "userId", select: "firstName lastName username email -_id " },
    { path: "jobId", select: "jobTitle -_id" },
  ]);
  if (!applicationExist)
    return next(new Error("Application not found", { cause: 404 }));

  //send email
  if (acceptance == "true")
    utils.emailEmitter.emit("accept", {
      email: applicationExist.userId.email,
      username: applicationExist.userId.username,
      jobTitle: applicationExist.jobId.jobTitle,
    });
  else
    utils.emailEmitter.emit("reject", {
      email: applicationExist.userId.email,
      username: applicationExist.userId.username,
      jobTitle: applicationExist.jobId.jobTitle,
    });

  return res
    .status(200)
    .json({ success: true, message: "Confirmation email sent" });
};

//application sheet
export const exportApplications = async (req, res, next) => {
  const { companyId } = req.params;
  const { createdAt: date } = req.query;

  //solve issue date is subtracted by one
  let createdAt = new Date(date);
  createdAt = createdAt.setDate(createdAt.getDate() + 1);

  //query
  const companyExist = await models.Company.findById(companyId).populate({
    path: "relatedJobs",
    populate: {
      path: "relatedApplications",
      match: {
        createdAt: {
          $gte: new Date(createdAt).setUTCHours(0, 0, 0, 0),
          $lt: new Date(createdAt).setUTCHours(23, 59, 59, 999),
        },
      },
      populate: { path: "userId", select: "username firstName lastName -_id" },
    },
  });

  if (!companyExist)
    return next(new Error("Company not exist", { cause: 404 }));

  let applications = companyExist.relatedJobs.flatMap((job) =>
    job.relatedApplications.map((app) => ({
      "User name": app.userId.username.toString(),
      "Job title": job.jobTitle,
      "Job location": job.jobLocation,
      "Job working time": job.workingTime,
      "Job experience level": job.experienceLevel,
      Status: app.status,
      "Submitted at": app.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      "CV url": app.userCV?.secure_url || "",
      "Job Description": job.jobDescription,
    }))
  );

  //save the file at temp
  const path = utils.saveToExcel({
    data: applications,
    fileName: `${companyExist.companyName}_applications`,
  });

  // send to download
  return res.download(path, (err) => {
    if (err) return next(new Error(`Error downloading file:, ${err}`));
    //delete the file after download
    fs.unlinkSync(path);
  });
};
