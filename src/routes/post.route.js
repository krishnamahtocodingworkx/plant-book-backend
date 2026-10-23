import express from "express";
import PostController from "../controllers/post.controller.js";
import { validate } from "../utils/commonFunctions.js";
import {
  createPostSchema,
  getProfilePostQuerySchema,
} from "../validations/post.js";
import { REQUEST_OBJECT } from "../utils/constant.js";
import { userIdParamsValidation } from "../validations/common.js";

const postRouter = express.Router();
postRouter.post(
  "/create",
  validate(createPostSchema),
  PostController.addNewPost,
);

postRouter.get(
  "/profile/:userId",
  validate(userIdParamsValidation, REQUEST_OBJECT.PARAM),
  validate(getProfilePostQuerySchema, REQUEST_OBJECT.QUERY),
  PostController.getMyAllPosts,
);

export default postRouter;
