import { Router } from "express";
import * as chatService from "./chat.service.js";
import * as chatValidation from "./chat.validation.js";
import { roles } from "../../common/index.common.js";
import { asyncHandler } from "../../utils/index.utils.js";
import {
  isAuthenticated,
  isAuthorized,
  validateSchema,
} from "../../middleware/index.middlewares.js";

const router = Router();

router.get(
  "/get/:userId",
  isAuthenticated(process.env.USER_BEARER),
  isAuthorized(roles.USER),
  validateSchema(chatValidation.getChat),
  asyncHandler(chatService.getChat)
);

export default router;
