import joi from "joi";
import { validationMiddleware } from "../../helpers.js";

const schema = joi.object().keys({
  name: joi.string().required(),
  permissions: joi.array().items(joi.string().valid("READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES")).required(),
});

export const validateGroup = validationMiddleware(schema);
