import joi from "joi";
import { PASSWORD_REG, PHONE_REG } from "../../common/index.common.js";
import { ageValidator } from "./../../common/index.common.js";

//signup
export const signup = joi
  .object({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(PASSWORD_REG).required(),
    mobileNumber: joi.string().pattern(PHONE_REG).required(),
    DOB: joi.date().iso().custom(ageValidator).required(),
  })
  .required();

//confirm otp
export const confirmOTP = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
  })
  .required();

//login
export const login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().pattern(PASSWORD_REG).required(),
  })
  .required();

//reset password
export const resetPassword = joi
  .object({
    otp: joi.string().required(),
    password: joi
      .string()
      .pattern(PASSWORD_REG)
      .message(
        "Must contain (8 - 64) uppercase, lowercase, number, special characters."
      )
      .required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

export const generateAccessToken = joi
  .object({
    refresh_token: joi.string().required(),
  })
  .required();

//continueWithGoogle
export const continueWithGoogle = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();
