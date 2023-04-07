import { ObjectSchema, ValidationErrorItem } from "joi";
import { Request, Response, NextFunction } from "express";

const errorResponse = (schemaErrors: ValidationErrorItem[]) => {
  const errors = schemaErrors.map(({ path, message }) => {
    return { path, message };
  });
  
return {
    status: "failed",
    errors,
  };
};

export const validationMiddleware = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });
    console.error(error);

    if (error && error.isJoi) {
      res.status(400).json(errorResponse(error.details));
    } else {
      next();
    }
  };
};
