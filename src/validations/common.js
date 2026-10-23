import Joi from "joi";

export const IdValidation = (key) =>
  Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": `${key} must be a valid MongoDB ObjectId`,
      "string.length": `${key} must be a 24-character ObjectId`,
      "any.required": `${key} is required`,
    });

export const userIdParamsValidation = Joi.object({
  userId: IdValidation("userId"),
});
