import { Router } from "express";
import * as JobValidation from "./job.validation.js";
import * as jobService from "./job.service.js";
import { asyncHandler } from "../../utils/index.utils.js";
import {
  extensions,
  fileInputFields,
  roles,
} from "../../common/index.common.js";
import {
  isAuthenticated,
  isAuthorized,
  singleUploader,
  validateSchema,
} from "./../../middleware/index.middlewares.js";

const router = Router({ mergeParams: true });

router.post(
  "/add",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(JobValidation.addJob),
  asyncHandler(jobService.addJob)
);

router.patch(
  "/update/:jobId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(JobValidation.updateJob),
  asyncHandler(jobService.updateJob)
);

router.delete(
  "/delete/:jobId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(JobValidation.deleteJob),
  asyncHandler(jobService.deleteJob)
);

router.get(
  "/search",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(JobValidation.searchJob),
  asyncHandler(jobService.searchJob)
);

router.get(
  "/find/:companyId/:jobId?",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(JobValidation.getCompanyJob),
  asyncHandler(jobService.getCompanyJob)
);

router.get(
  "/get-applications/:jobId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(JobValidation.getAllApplications),
  asyncHandler(jobService.getAllApplications)
);

router.post(
  "/apply/:jobId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  singleUploader({
    fieldName: fileInputFields.cv,
    allowedExtensions: extensions.DOCUMENTS,
  }),
  validateSchema(JobValidation.applyForJob),
  asyncHandler(jobService.applyForJob)
);

router.post(
  "/accept-application/:applicationId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(JobValidation.acceptApplication),
  asyncHandler(jobService.acceptApplication)
);

router.get(
  "/export/applications/:companyId",
  validateSchema(JobValidation.exportApplications),
  asyncHandler(jobService.exportApplications)
);

export default router;
