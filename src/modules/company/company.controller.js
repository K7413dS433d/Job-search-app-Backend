import { Router } from "express";
import * as companyValidation from "./company.validation.js";
import * as companyService from "./company.service.js";
import { fileInputFields, roles } from "../../common/index.common.js";
import { asyncHandler } from "../../utils/index.utils.js";
import {
  isAuthenticated,
  isAuthorized,
  singleUploader,
  validateSchema,
} from "./../../middleware/index.middlewares.js";

const router = Router();

//add company
router.post(
  "/add",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  singleUploader({ fieldName: fileInputFields.legalAttachment }),
  validateSchema(companyValidation.addCompany),
  asyncHandler(companyService.addCompany)
);

//update company
router.post(
  "/update/:companyId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(companyValidation.updateCompany),
  asyncHandler(companyService.updateCompany)
);

//delete company
router.delete(
  "/delete/:companyId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER, roles.ADMIN),
  validateSchema(companyValidation.deleteCompany),
  asyncHandler(companyService.deleteCompany)
);

//get company with related jobs
router.get(
  "/get/:companyId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(companyValidation.getCompany),
  asyncHandler(companyService.getCompany)
);

//search by name
router.get(
  "/search",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(companyValidation.getCompanyByName),
  asyncHandler(companyService.getCompanyByName)
);

//update company logo
router.patch(
  "/update/logo/:companyId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  singleUploader({ fieldName: fileInputFields.logo }),
  validateSchema(companyValidation.updateCompanyLogo),
  asyncHandler(companyService.updateCompanyLogo)
);

//update company cover
router.patch(
  "/update/cover/:companyId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  singleUploader({ fieldName: fileInputFields.coverPic }),
  validateSchema(companyValidation.updateCompanyCover),
  asyncHandler(companyService.updateCompanyCover)
);

//delete company logo
router.delete(
  "/delete/logo/:companyId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(companyValidation.deleteCompanyLogo),
  asyncHandler(companyService.deleteCompanyLogo)
);

//delete company cover
router.delete(
  "/delete/cover/:companyId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(companyValidation.deleteCompanyCover),
  asyncHandler(companyService.deleteCompanyCover)
);

export default router;
