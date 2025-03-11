export const ageValidator = (value, helper) => {
  const yearOB = new Date(value).getFullYear();
  const currentYear = new Date().getFullYear();
  if (currentYear - yearOB > 18) return true;
  return helper.message(
    `Your Date of berth must be less than this year ${currentYear - 18}`
  );
};
