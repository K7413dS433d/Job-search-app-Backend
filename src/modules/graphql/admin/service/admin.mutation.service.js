import models from "./../../../../database/models/index.models.js";
import * as utils from "./../../../../utils/index.utils.js";
import * as middlewares from "./../../../../middleware/index.middlewares.js";
import * as common from "./../../../../common/index.common.js";

//ban specific user
export const banOrUnPanUser = async (_, args, context) => {
  //auth
  await middlewares.graphIsAuthenticated({ context });
  middlewares.graphIsAuthorized(context, common.roles.ADMIN);

  const { userId } = args;
  const userExist = await models.User.findById(userId);

  if (!userExist)
    return utils.setResponse({
      message: "User not found",
      status: 404,
    });

  let message = "";

  if (userExist.bannedAt) {
    userExist.bannedAt = undefined;
    message = `User ${userExist.username} unbanned successfully`;
  } else {
    //ban user
    userExist.bannedAt = new Date();
    message = `User ${userExist.username} banned successfully`;
  }

  await userExist.save();

  return utils.setResponse({
    message,
    status: 200,
  });
};

//ban specific company
export const banOrUnPanCompany = async (_, args, context) => {
  //auth
  await middlewares.graphIsAuthenticated({ context });
  middlewares.graphIsAuthorized(context, common.roles.ADMIN);

  const { companyId } = args;
  const companyExist = await models.Company.findById(companyId);

  if (!companyExist)
    return utils.setResponse({
      message: "Company not found",
      status: 404,
    });

  let message = "";

  if (companyExist.bannedAt) {
    companyExist.bannedAt = undefined;
    message = `Company ${companyExist.username} unbanned successfully`;
  } else {
    //ban user
    companyExist.bannedAt = new Date();
    message = `Company ${companyExist.username} banned successfully`;
  }

  await companyExist.save();

  return utils.setResponse({
    message,
    status: 200,
  });
};

//approve specific company
export const approveCompany = async (_, args, context) => {
  //auth
  await middlewares.graphIsAuthenticated({ context });
  middlewares.graphIsAuthorized(context, common.roles.USER);

  const { companyId } = args;
  const companyExist = await models.Company.findById(companyId);

  if (!companyExist)
    return utils.setResponse({
      message: "Company not found",
      status: 404,
    });

  companyExist.approvedByAdmin = true;
  await companyExist.save();

  return utils.setResponse({
    message: "Company approved successfully",
    status: 200,
  });
};
