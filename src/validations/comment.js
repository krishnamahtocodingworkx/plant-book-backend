import Joi from "joi";
import { IdValidation } from "./common.js";

const commentSchema = {
  CreateCommentSchema: Joi.object({
    comment: Joi.string().trim().required().max(5000).messages({
      "string.empty": "Comment cannot be empty.",
      "string.max": "Comment cannot exceed 5000 characters.",
      "any.required": "Comment is required.",
    }),

    postId: IdValidation("postId"),

    parentCommentId: Joi.string()
      .hex()
      .length(24)
      .allow(null)
      .optional()
      .messages({
        "string.hex": "Invalid parent comment ID.",
        "string.length": "Parent comment ID must be a valid MongoDB ObjectId.",
      }),
  }),

  getCommentListSchema: Joi.object({
    postId: IdValidation("postId"),

    parentCommentId: Joi.string()
      .hex()
      .length(24)
      .allow(null)
      .optional()
      .messages({
        "string.hex": "Invalid parent comment ID.",
        "string.length": "Parent comment ID must be a valid MongoDB ObjectId.",
      }),
  }),
};

export default commentSchema;
