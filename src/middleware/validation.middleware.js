export const validateSchema = (Schema) => {
  return (req, res, next) => {
    const data = {
      ...req.body,
      ...req.params,
      ...req.query,
    };

    if (req.file || req.files?.length) {
      data.file = req.file || req.files;
    }

    const { error } = Schema.validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map((error) => error.message);
      return next(new Error(errors, { cause: 400 }));
    }
    return next();
  };
};
