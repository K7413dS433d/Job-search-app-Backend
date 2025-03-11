import models from "./../../database/models/index.models.js";
import * as utils from "../../utils/index.utils.js";
import { otpTypes, providers } from "../../common/index.common.js";

//signup
export const signup = async (req, res, next) => {
  const { email } = req.body;

  //check email is exist
  const emailExist = await models.User.findOne({ email });

  if (emailExist)
    return next(
      new Error("Email already exist try to signup with google", { cause: 400 })
    );

  //create new user
  const newUser = new models.User(req.body);

  //generate otp
  const otp = utils.otpGenerator();

  //add otp to user
  newUser.addOTP({ otp });

  //send otp
  utils.emailEmitter.emit("sendEmail", { email, otp });

  //save user
  await newUser.save();

  return res
    .status(201)
    .json({ success: true, message: "User created successfully" });
};

//confirm otp
export const confirmOTP = async (req, res, next) => {
  const { otp, email } = req.body;

  //check user exist and not confirmed
  const userExist = await models.User.findOne({ email });
  if (!userExist) return next(new Error("User not found", { cause: 404 }));

  //check if the user already confirmed
  if (userExist.isConfirmed === true)
    return next(new Error("Account already confirmed", { cause: 409 }));

  //check otp match and not expired
  const otpExist = userExist.OTP.find(
    (filed) =>
      utils.compare({ data: otp, hash: filed.otp }) &&
      filed.expiresIn > utils.datedInSeconds() &&
      filed.type == otpTypes.CONFIRM_EMAIL
  );

  if (!otpExist) return next(new Error("Wrong or Expired OTP", { cause: 400 }));

  userExist.isConfirmed = true;
  await userExist.save();

  return res
    .status(200)
    .json({ success: true, message: "Email confirmed successfully" });
};

//login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  //check exist
  const userExist = await models.User.findOne({ email });
  if (!userExist)
    return next(new Error("invalid Email or password", { cause: 400 }));

  if (userExist.provider != providers.SYSTEM)
    return next(
      new Error("Cannot login with this account try to login with google", {
        cause: 405,
      })
    );

  if (!utils.compare({ data: password, hash: userExist.password }))
    //check password
    return next(new Error("invalid Email or password", { cause: 400 }));

  //generate tokens
  const access_token = utils.generateToken({
    payload: { id: userExist.id },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXP },
  });

  const refresh_token = utils.generateToken({
    payload: { id: userExist.id },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXP },
  });

  //restore account from soft delete
  if (userExist.deletedAt) userExist.deletedAt = undefined;

  //save
  await userExist.save();

  return res.status(200).json({
    success: true,
    message: "Login successfully",
    data: {
      access_token,
      refresh_token,
    },
  });
};

// signup/login with google
export const continueWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;

  const { name, email, picture } = await utils.verifyGoogleToken(idToken);

  const [firstName, lastName] = name.split(" ");

  const userExist = await models.User.findOne({ email });
  let newUser = "";
  let userId = userExist.id;
  let message = "Login successfully";

  if (!userExist) {
    newUser = new models.User({
      email,
      firstName,
      lastName,
      isConfirmed: true,
    });
    newUser.profilePic.secure_url = picture;
    userId = newUser.id;
    message = "User created successfully";
    await newUser.save();
  } else {
    //restore account from soft delete
    if (userExist.deletedAt) userExist.deletedAt = undefined;
    //save
    await userExist.save();
  }

  //generate tokens
  const access_token = utils.generateToken({
    payload: { id: userId },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXP },
  });

  const refresh_token = utils.generateToken({
    payload: { id: userId },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXP },
  });

  return res.status(200).json({
    success: true,
    message,
    data: {
      access_token: access_token,
      refresh_token: refresh_token,
      user: utils.userReturn(userExist ? userExist : newUser),
    },
  });
};

//forget password otp
export const forgetPasswordOTP = async (req, res, next) => {
  const { authUser } = req;

  //check is confirmed
  if (!authUser.isConfirmed)
    return next(new Error("Confirm your email first", { cause: 401 }));

  //generate otp
  const otp = utils.otpGenerator();
  //send otp
  utils.emailEmitter.emit("sendEmail", { email: authUser.email, otp });
  //add otp to user
  authUser.addOTP({ otp, type: otpTypes.FORGET_PASSWORD });
  //save user
  await authUser.save();

  res.status(200).json({ success: true, message: "OTP send Successfully" });
};

//reset password
export const resetPassword = async (req, res, next) => {
  const { otp, password } = req.body;
  const { authUser } = req;

  const otpExist = authUser.OTP.find(
    (filed) =>
      utils.compare({ data: otp, hash: filed.otp }) &&
      filed.expiresIn > new Date() &&
      filed.type == otpTypes.FORGET_PASSWORD
  );

  //check for valid otp
  if (!otpExist) return next(new Error("Wrong or Expired OTP", { cause: 400 }));

  //change the password
  authUser.password = password;
  await authUser.save();

  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
};

//refresh token
export const generateAccessToken = async (req, res, next) => {
  const { refresh_token } = req.body;
  const { authUser } = req;

  //verify refresh token
  const payload = utils.verifyToken({ token: refresh_token });
  //refresh token initiate date in seconds
  const refresh_token_iat = payload.iat;

  //change credential time initiate date in seconds
  const changeCredentialTime = utils.datedInSeconds(
    authUser.changeCredentialTime
  );

  //check is password not changed after generate refresh token
  if (changeCredentialTime > refresh_token_iat)
    return next(new Error("Please login again", { cause: 401 }));

  //generate new access token
  const access_token = utils.generateToken({
    payload: { id: authUser.id },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXP },
  });

  return res
    .status(200)
    .json({ message: "Successfully", data: { access_token } });
};
