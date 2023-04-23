import { ObjectSchema, ValidationErrorItem } from "joi";
import { Request, Response, NextFunction } from "express";
import { ServiceLogger, logger } from "./logger";

export const errorResponse = (schemaErrors: ValidationErrorItem[]) => {
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

    if (error && error.isJoi) {
      const errorsDetails = errorResponse(error.details);
      logger.warn("validate service error:", errorsDetails);
      res.status(400).json(errorsDetails);
    } else {
      next();
    }
  };
};

export const sendResponse400 = (res: Response, serviceLogger: ServiceLogger, message?: string) => {
  serviceLogger.logger.error(message || "Bad Request");
  res.status(400).json({ message: message || "Bad Request" });
};

export const sendResponse200 = (res: Response, data: any) => res.status(200).json({ ...data });
