import { Router } from "express";
import * as authSchema from "./auth.validation.js";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/index.utils.js";
import {
  validateSchema,
  isAuthenticated,
} from "./../../middleware/index.middlewares.js";

const router = Router();

router.post(
  "/signup",
  validateSchema(authSchema.signup),
  asyncHandler(authService.signup)
);

router.post(
  "/confirm-otp",
  validateSchema(authSchema.confirmOTP),
  asyncHandler(authService.confirmOTP)
);

router.get(
  "/login",
  validateSchema(authSchema.login),
  asyncHandler(authService.login)
);

router.post(
  "/google",
  validateSchema(authSchema.continueWithGoogle),
  asyncHandler(authService.continueWithGoogle)
);

router.post(
  "/forget-password-otp",
  isAuthenticated(),
  asyncHandler(authService.forgetPasswordOTP)
);

router.post(
  "/reset-password",
  isAuthenticated(),
  validateSchema(authSchema.resetPassword),
  asyncHandler(authService.resetPassword)
);

router.get(
  "/get-access_token",
  isAuthenticated(),
  validateSchema(authSchema.generateAccessToken),
  asyncHandler(authService.generateAccessToken)
);

export default router;
