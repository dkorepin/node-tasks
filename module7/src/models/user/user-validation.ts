import joi from "joi";
import { validationMiddleware } from "../../helpers";

const schema = joi.object().keys({
  login: joi.string().required(),
  password: joi.string().required(),
  age: joi.number().min(4).max(130).required(),
});

export const validateUser = validationMiddleware(schema);
