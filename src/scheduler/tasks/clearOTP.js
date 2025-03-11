import { CronJob } from "cron";
import models from "./../../database/models/index.models.js";

const clearOTP_task = async function () {
  await models.User.updateMany(
    { "OTP.expiresIn": { $lt: new Date() } },
    { $pull: { OTP: { expiresIn: { $lt: new Date() } } } }
  );
  console.log("OTP cleared!");
};

export const job = new CronJob(
  "0 */6 * * *", // cronTime
  clearOTP_task, // onTick
  null, // onComplete
  true // start
);
