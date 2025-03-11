import joi from "joi";
import * as common from "./../../common/index.common.js";

//update user profile
export const updateProfile = joi
  .object({
    firstName: joi.string(),
    lastName: joi.string(),
    DOB: joi.date(),
    mobileNumber: joi
      .string()
      .pattern(common.PHONE_REG)
      .message("Enter valid phone number"),
    gender: joi.string().valid(...Object.values(common.genders)),
  })
  .or("firstName", "lastName", "mobileNumber", "gender", "DOB");

//get any user profile
export const getProfile = joi
  .object({
    userId: common.objectIdType.required(),
  })
  .required();

//change password
export const changePassword = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi
      .string()
      .pattern(common.PASSWORD_REG)
      .message(
        "password must be 8 characters long and contain at least one lowercase letter,one uppercase letter,numbers,Special_Char"
      )
      .required(),
    confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();

//update profile picture
export const updateProfilePic = joi
  .object({
    file: common
      .fileValidatorType(common.fileInputFields.profilePic)
      .required(),
  })
  .required();

//update cover picture
export const updateCoverPic = joi
  .object({
    file: common.fileValidatorType(common.fileInputFields.coverPic).required(),
  })
  .required();
