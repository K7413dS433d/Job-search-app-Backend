import models from "./../../database/models/index.models.js";
import * as utils from "./../../utils/index.utils.js";
import {
  defaultCoverPic,
  defaultLogo,
  roles,
} from "../../common/index.common.js";

//add company
export const addCompany = async (req, res, next) => {
  const { authUser } = req;
  const { companyName, companyEmail } = req.body;

  //check company exist
  const companyExist = await models.Company.findOne({
    $or: [{ companyName }, { companyEmail }],
  });

  if (companyExist)
    return next(new Error("Company name or email already exist"));

  //create in company
  const newCompany = new models.Company({
    ...req.body,
    createdBy: authUser.id,
    logo: defaultLogo,
  });

  //upload legal attachment
  const folder = utils.pathResolver({
    path: `companies/${newCompany.id}/legalAttachment`,
  });

  const legalAttachment = await utils.uploadFile({
    req,
    options: { fileName: "legalFile", folder },
  });

  newCompany.legalAttachment = legalAttachment;

  //save new company
  await newCompany.save();

  return res.status(200).json({
    success: true,
    message: "Company created successfully",
    data: { company: newCompany },
  });
};

//update company
export const updateCompany = async (req, res, next) => {
  const { authUser } = req;
  const { companyId } = req.params;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const companyExist = await models.Company.findById(companyId);
  if (!companyExist)
    return next(new Error("company not found", { cause: 404 }));

  if (companyExist.createdBy.toString() != authUser.id)
    return next(new Error("You are not the owner", { cause: 401 }));

  if (companyEmail) companyExist.companyEmail = companyEmail;
  if (companyName) companyExist.companyName = companyName;
  if (description) companyExist.description = description;
  if (industry) companyExist.industry = industry;
  if (address) companyExist.address = address;
  if (numberOfEmployees) companyExist.numberOfEmployees = numberOfEmployees;

  // Save updated company
  await companyExist.save();

  return res.status(200).json({
    success: true,
    message: "Company updated successfully",
    data: { company: companyExist },
  });
};

//delete company
export const deleteCompany = async (req, res, next) => {
  const { authUser } = req;
  const { companyId } = req.params;

  const companyExist = await models.Company.findById(companyId);
  if (!companyExist)
    return next(new Error("Company not found", { cause: 404 }));

  if (
    companyExist.createdBy.toString() != authUser.id &&
    authUser.role != roles.ADMIN
  )
    return next(new Error("Unauthorized user", { cause: 401 }));

  companyExist.deletedAt = new Date();
  await companyExist.save();

  return res.status(200).json({
    success: true,
    message: "Company deleted successfully",
  });
};

//get company with related jobs
export const getCompany = async (req, res, next) => {
  const { companyId } = req.params;

  const companyExist = await models.Company.findById(companyId).populate(
    "relatedJobs"
  );
  if (!companyExist)
    return next(new Error("Company not exist", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: "Successfully",
    data: { company: companyExist },
  });
};

//get company by name
export const getCompanyByName = async (req, res, next) => {
  const { name } = req.query;

  const companyExist = await models.Company.find({
    companyName: { $regex: name },
  }).populate("relatedJobs");

  if (!companyExist)
    return next(new Error("Company not exist", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: "Successfully",
    data: { company: companyExist },
  });
};

//upload company logo
export const updateCompanyLogo = async (req, res, next) => {
  const { authUser } = req;
  const { companyId } = req.params;

  //check company exist
  const companyExist = await models.Company.findById(companyId);
  if (!companyExist)
    return next(new Error("Company not exist", { cause: 404 }));

  //owner of company
  if (companyExist.createdBy.toString() != authUser.id)
    return next(new Error("Unauthorized user", { cause: 401 }));

  const path = utils.pathResolver({
    path: `companies/${companyExist.id}/logo`,
  });
  const { secure_url, public_id } = await utils.uploadFile({
    req,
    options: {
      folder: path,
      fileName: "companyLogo",
    },
  });

  //update profile pic
  companyExist.logo.secure_url = secure_url;
  companyExist.logo.public_id = public_id;

  //save the user
  await companyExist.save();

  return res.status(200).json({
    success: true,
    message: "Company logo uploaded successfully",
    data: { company: companyExist },
  });
};

//upload company cover
export const updateCompanyCover = async (req, res, next) => {
  const { authUser } = req;
  const { companyId } = req.params;

  //check company exist
  const companyExist = await models.Company.findById(companyId);
  if (!companyExist)
    return next(new Error("Company not exist", { cause: 404 }));

  //owner of company
  if (companyExist.createdBy.toString() != authUser.id)
    return next(new Error("Unauthorized user", { cause: 401 }));

  const path = utils.pathResolver({
    path: `companies/${companyExist.id}/coverPic`,
  });
  const { secure_url, public_id } = await utils.uploadFile({
    req,
    options: {
      folder: path,
      fileName: "companyCoverPic",
    },
  });

  //update profile pic
  companyExist.coverPic.secure_url = secure_url;
  companyExist.coverPic.public_id = public_id;

  //save the user
  await companyExist.save();

  return res.status(200).json({
    success: true,
    message: "Company cover picture uploaded successfully",
    data: { company: companyExist },
  });
};

//delete company logo
export const deleteCompanyLogo = async (req, res, next) => {
  const { authUser } = req;
  const { companyId } = req.params;

  //check company exist
  const companyExist = await models.Company.findById(companyId);
  if (!companyExist)
    return next(new Error("Company not exist", { cause: 404 }));

  //owner of company
  if (companyExist.createdBy.toString() != authUser.id)
    return next(new Error("Unauthorized user", { cause: 401 }));

  //delete old from cloud
  if (companyExist.logo.public_id != defaultLogo.PUBLIC_ID)
    await utils.deleteFile(companyExist.logo.public_id);

  //restore defaults
  companyExist.logo.public_id = defaultLogo.PUBLIC_ID;
  companyExist.logo.secure_url = defaultLogo.SECURE_URL;

  //save
  await companyExist.save();

  return res.status(200).json({
    success: true,
    message: "Company logo deleted successfully",
    data: { company: companyExist },
  });
};

//delete company cover
export const deleteCompanyCover = async (req, res, next) => {
  const { authUser } = req;
  const { companyId } = req.params;

  //check company exist
  const companyExist = await models.Company.findById(companyId);
  if (!companyExist)
    return next(new Error("Company not exist", { cause: 404 }));

  //owner of company
  if (companyExist.createdBy.toString() != authUser.id)
    return next(new Error("Unauthorized user", { cause: 401 }));

  //delete old from cloud
  if (companyExist.coverPic.public_id != defaultCoverPic.PUBLIC_ID)
    await utils.deleteFile(companyExist.coverPic.public_id);

  //restore defaults
  companyExist.coverPic.public_id = defaultCoverPic.PUBLIC_ID;
  companyExist.coverPic.secure_url = defaultCoverPic.SECURE_URL;

  //save
  await companyExist.save();

  return res.status(200).json({
    success: true,
    message: "Company logo deleted successfully",
    data: { company: companyExist },
  });
};
