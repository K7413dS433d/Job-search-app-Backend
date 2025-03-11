import joi from "joi";
import { employerRange } from "../../common/index.common.js";
import * as common from "./../../common/index.common.js";

const companyIdSchema = joi
  .object({
    companyId: common.objectIdType.required(),
  })
  .required();

//add company
export const addCompany = joi
  .object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi
      .string()
      .valid(...Object.values(employerRange))
      .required(),
    companyEmail: joi.string().email().required(),
    file: common
      .fileValidatorType(common.fileInputFields.legalAttachment)
      .required(),
  })
  .required();

//update company
export const updateCompany = joi
  .object({
    companyId: common.objectIdType.required(),
    companyName: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.string().valid(...Object.values(employerRange)),
    companyEmail: joi.string().email(),
  })
  .or(
    "companyName",
    "description",
    "industry",
    "address",
    "numberOfEmployees",
    "companyEmail"
  );

//delete company
export const deleteCompany = companyIdSchema;

//get company
export const getCompany = companyIdSchema;

//get company by name
export const getCompanyByName = joi
  .object({
    name: joi.string().required(),
  })
  .required();

//update company logo
export const updateCompanyLogo = joi
  .object({
    companyId: common.objectIdType,
    file: common.fileValidatorType(common.fileInputFields.logo),
  })
  .required();

//update company cover
export const updateCompanyCover = joi
  .object({
    companyId: common.objectIdType,
    file: common.fileValidatorType(common.fileInputFields.coverPic),
  })
  .required();

//delete company logo
export const deleteCompanyLogo = companyIdSchema;

//delete company cover
export const deleteCompanyCover = companyIdSchema;
