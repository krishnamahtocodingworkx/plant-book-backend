import express from "express";
import { validate } from "../utils/commonFunctions.js";
import commentController from "../controllers/comment.controller.js";
import commentSchema from "../validations/comment.js";
import { REQUEST_OBJECT } from "../utils/constant.js";

const commentRouter = express.Router();

commentRouter.post(
  "/create",
  validate(commentSchema.CreateCommentSchema),
  commentController.addComment,
);

commentRouter.get(
  "/list",
  validate(commentSchema.getCommentListSchema, REQUEST_OBJECT.QUERY),
  commentController.getCommentList,
);

export default commentRouter;
