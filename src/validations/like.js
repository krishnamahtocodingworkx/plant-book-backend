import Joi from "joi";
import { IdValidation } from "./common.js";

export const likeUnlikeSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.hex": "User ID must be a valid MongoDB ObjectId",
    "string.length": "User ID must be a 24-character ObjectId",
    "any.required": "User ID is required",
  }),
  postId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Post ID must be a valid MongoDB ObjectId",
    "string.length": "Post ID must be a 24-character ObjectId",
    "any.required": "Post ID is required",
  }),
});

export const likeListSchema = Joi.object({
  postId: IdValidation("postId"),
});
