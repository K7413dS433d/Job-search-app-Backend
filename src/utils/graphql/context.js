export const context = (req) => {
  return { access_token: req.headers.authorization };
};
