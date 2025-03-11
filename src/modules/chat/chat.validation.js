import joi from "joi";
import * as common from "../../common/index.common.js";

export const getChat = joi
  .object({
    userId: common.objectIdType.required(),
  })
  .required();
