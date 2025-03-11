export const userReturn = (user) => {
  return {
    ...user.toJSON(),
    password: undefined,
    OTP: undefined,
    role: undefined,
  };
};
