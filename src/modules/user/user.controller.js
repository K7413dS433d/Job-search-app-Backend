import { Router } from "express";
import * as userService from "./user.service.js";
import * as userValidation from "./user.validation.js";
import { extensions, roles } from "../../common/index.common.js";
import { asyncHandler } from "../../utils/index.utils.js";
import { fileInputFields } from "./../../common/index.common.js";
import {
  isAuthorized,
  isAuthenticated,
  validateSchema,
  singleUploader,
} from "./../../middleware/index.middlewares.js";

const router = Router();

router.patch(
  "/update",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(userValidation.updateProfile),
  asyncHandler(userService.updateProfile)
);

router.get(
  "/get-profile",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  asyncHandler(userService.getLoggedInUserProfile)
);

router.get(
  "/get/:userId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(userValidation.getProfile),
  asyncHandler(userService.getProfile)
);

router.patch(
  "/change-password",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(userValidation.changePassword),
  asyncHandler(userService.changePassword)
);

router.patch(
  "/profile-picture",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  singleUploader({
    fieldName: fileInputFields.profilePic,
    allowedExtensions: extensions.IMAGES,
  }),
  validateSchema(userValidation.updateProfilePic),
  asyncHandler(userService.updateProfilePic)
);

router.patch(
  "/cover-picture",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  singleUploader({
    fieldName: fileInputFields.coverPic,
    allowedExtensions: extensions.IMAGES,
  }),
  validateSchema(userValidation.updateCoverPic),
  asyncHandler(userService.updateCoverPic)
);

router.delete(
  "/profile-picture",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  asyncHandler(userService.deleteProfilePic)
);

router.delete(
  "/cover-picture",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  asyncHandler(userService.deleteCoverPic)
);

router.delete(
  "/account",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  asyncHandler(userService.deleteAccount)
);

export default router;
