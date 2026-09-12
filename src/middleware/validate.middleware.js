const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
  };
};

module.exports = validate;
