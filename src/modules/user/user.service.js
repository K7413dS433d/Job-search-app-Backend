import models from "./../../database/models/index.models.js";
import * as utils from "./../../utils/index.utils.js";
import {
  defaultCoverPic,
  defaultProfilePic,
} from "../../common/index.common.js";

//update profile
export const updateProfile = async (req, res, next) => {
  const { authUser } = req;

  const { firstName, lastName, DOB, mobileNumber, gender } = req.body;

  if (firstName) authUser.firstName = firstName;

  if (lastName) authUser.lastName = lastName;

  if (DOB) authUser.DOB = DOB;

  if (mobileNumber) authUser.mobileNumber = mobileNumber;

  if (gender) authUser.gender = gender;

  //save authUser
  await authUser.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user: utils.userReturn(authUser) },
  });
};

//get logged in user profile
export const getLoggedInUserProfile = async (req, res, next) => {
  const { authUser } = req;

  return res.status(200).json(
    utils.response({
      message: "Successfully",
      data: { user: utils.userReturn(authUser) },
    })
  );
};

//get profile for any user
export const getProfile = async (req, res, next) => {
  const { userId } = req.params;

  const userExist = await models.User.findById(userId).select(
    "firstName lastName username mobileNumber profilePic coverPic"
  );

  if (!userExist) return next(new Error("User not found", { cause: 404 }));

  const data = {
    ...userExist.toJSON(),
    firstName: undefined,
    lastName: undefined,
  };

  return res.status(200).json(
    utils.response({
      message: "Successfully",
      data: {
        user: data,
      },
    })
  );
};

//change password
export const changePassword = async (req, res, next) => {
  const { authUser } = req;
  const { newPassword, oldPassword } = req.body;

  if (
    !utils.compare({
      data: oldPassword,
      hash: authUser.password,
    })
  )
    return next(new utils.AppError("Wrong password", 400));

  //change password
  authUser.password = newPassword;
  await authUser.save();

  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
};

//update profile picture
export const updateProfilePic = async (req, res, next) => {
  const { authUser } = req;

  const path = utils.pathResolver({ path: `users/${authUser.id}/profilePic` });
  const { secure_url, public_id } = await utils.uploadFile({
    req,
    options: {
      folder: path,
      fileName: "profilePic",
    },
  });

  //update profile pic
  authUser.profilePic.secure_url = secure_url;
  authUser.profilePic.public_id = public_id;

  //save the user
  await authUser.save();

  return res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    data: { user: utils.userReturn(authUser) },
  });
};

//update profile picture
export const updateCoverPic = async (req, res, next) => {
  const { authUser } = req;

  const path = utils.pathResolver({ path: `users/${authUser.id}/coverPic` });
  const { secure_url, public_id } = await utils.uploadFile({
    req,
    options: {
      folder: path,
      fileName: "coverPic",
    },
  });

  //update profile pic
  authUser.coverPic.secure_url = secure_url;
  authUser.coverPic.public_id = public_id;

  //save the user
  await authUser.save();

  return res.status(200).json({
    success: true,
    message: "Cover picture uploaded successfully",
    data: { user: utils.userReturn(authUser) },
  });
};

//delete profile pic
export const deleteProfilePic = async (req, res, next) => {
  const { authUser } = req;

  //delete old from cloud handled with google auth
  if (
    userExist.profilePic.public_id != defaultProfilePic.PUBLIC_ID &&
    userExist.profilePic.secure_url != defaultProfilePic.SECURE_URL
  )
    await utils.deleteFile(authUser.profilePic.public_id);

  //restore defaults
  authUser.profilePic.public_id = defaultProfilePic.PUBLIC_ID;
  authUser.profilePic.secure_url = defaultProfilePic.SECURE_URL;

  //save
  await authUser.save();
  return res.status(200).json({
    success: true,
    message: "Successfully",
    data: { user: utils.userReturn(authUser) },
  });
};

//delete profile pic
export const deleteCoverPic = async (req, res, next) => {
  const { authUser } = req;

  //delete old from cloud
  //delete old from cloud
  if (userExist.coverPic.public_id != defaultCoverPic.PUBLIC_ID)
    await utils.deleteFile(authUser.coverPic.public_id);

  //restore defaults
  authUser.coverPic.public_id = defaultCoverPic.PUBLIC_ID;
  authUser.coverPic.secure_url = defaultCoverPic.SECURE_URL;

  //save
  await authUser.save();

  return res.status(200).json({
    success: true,
    message: "Successfully",
    data: { user: utils.userReturn(authUser) },
  });
};

//delete account
export const deleteAccount = async (req, res, next) => {
  const { authUser } = req;

  authUser.deletedAt = new Date();

  //save user
  await authUser.save();

  return res
    .status(200)
    .json({ success: true, message: "Account deleted successfully" });
};
