import Joi from "joi";

export const userIdParamsValidation = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.hex": "User ID must be a valid MongoDB ObjectId",
    "string.length": "User ID must be a 24-character ObjectId",
    "any.required": "User ID is required",
  }),
});
