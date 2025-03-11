import { otpTypes } from "../../../common/index.common.js";
import { hash } from "../../../utils/index.utils.js";

//validate age
export const dateSchemaValidator = (v) => {
  const yearOB = new Date(v).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - yearOB > 18;
};

//adding hashed otp
export function addOTP({
  otp,
  expIn = +process.env.OTP_EXP_MINUTES,
  type = otpTypes.CONFIRM_EMAIL,
}) {
  this.OTP.push({
    otp: hash({ data: otp }),
    type,
    expiresIn: new Date(Date.now() + expIn * 60 * 1000), //expires in x minuets
  });
}
