import models from "./../../../../database/models/index.models.js";
import * as utils from "./../../../../utils/index.utils.js";
import * as middlewares from "./../../../../middleware/index.middlewares.js";
import * as common from "./../../../../common/index.common.js";

//get all data
export const getAllData = async (_, args, context) => {
  //auth
  await middlewares.graphIsAuthenticated({ context });
  middlewares.graphIsAuthorized(context, common.roles.ADMIN);

  //get data
  let userData = await models.User.find();
  userData = userData.map((u) => u.toJSON());
  const companiesData = await models.Company.find();

  return utils.setResponse({
    message: "Successfully",
    status: 200,
    data: { users: userData, companies: companiesData },
  });
};

