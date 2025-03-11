import models from "../../database/models/index.models.js";
import { verifyToken } from "../../utils/index.utils.js";

export const graphIsAuthenticated = async ({
  context,
  bearerKey = process.env.USER_BEARER,
}) => {
  //get bearer token
  const { access_token: bearerToken } = context;
  //check token
  if (!bearerToken) throw new Error("Token is required", { cause: 400 });

  //check bearer token
  const [bearer, token] = bearerToken.split(" ");

  if (bearer != bearerKey) {
    throw new Error("Invalid bearer token", { cause: 400 });
  }

  //check valid token
  const { id } = verifyToken({ token, secret: process.env.JWT_SECRETE });

  const userExist = await models.User.findById(id).select("-password -phone");
  if (!userExist)
    throw new Error("User is not login please login first", { cause: 400 });

  context.authUser = userExist;
  return true;
};
