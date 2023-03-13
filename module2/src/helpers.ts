import { ObjectSchema } from "joi";

const errorResponse = (schemaErrors) => {
  const errors = schemaErrors.map(({ path, message }) => {
    return { path, message };
  });

  return {
    status: "failed",
    errors,
  };
};

export const validationMiddleware = (schema: ObjectSchema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });
    console.log(error)

    if (error && error.isJoi) {
      res.status(400).json(errorResponse(error.details));
    } else {
      next();
    }
  };
};
