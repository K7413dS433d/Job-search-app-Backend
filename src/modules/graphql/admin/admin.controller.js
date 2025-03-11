import * as adminQueryService from "./service/admin.query.service.js";
import * as adminMutationService from "./service/admin.mutation.service.js";
import * as adminResponseType from "./types/admin.response.types.js";
import * as adminRequestType from "./types/admin.request.types.js";
import { messageResponse } from "../../../utils/index.utils.js";

export const adminQuery = {
  getAllData: {
    type: adminResponseType.getAllDataResponseType,
    resolve: adminQueryService.getAllData,
  },
};

export const adminMutation = {
  banUser: {
    type: messageResponse,
    args: {
      ...adminRequestType.banOrUnPanUserRequestType,
    },
    resolve: adminMutationService.banOrUnPanUser,
  },

  banCompany: {
    type: messageResponse,
    args: {
      ...adminRequestType.CompanyIDRequestType,
    },
    resolve: adminMutationService.banOrUnPanCompany,
  },

  approveCompany: {
    type: messageResponse,
    args: {
      ...adminRequestType.CompanyIDRequestType,
    },
    resolve: adminMutationService.approveCompany,
  },
};
