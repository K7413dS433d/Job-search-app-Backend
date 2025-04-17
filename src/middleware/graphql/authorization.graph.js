export const graphIsAuthorized = (context, ...allowedRoles) => {
  const { authUser } = context;
  if (!allowedRoles.includes(authUser.role))
    throw new Error("Not Authorized Access", { cause: 401 });
  return true;
};
