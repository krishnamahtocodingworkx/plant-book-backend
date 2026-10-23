import express from "express";
import { validate } from "../utils/commonFunctions.js";
import likeController from "../controllers/like.controller.js";
import { likeListSchema, likeUnlikeSchema } from "../validations/like.js";
import { REQUEST_OBJECT } from "../utils/constant.js";

const likeRouter = express.Router();

likeRouter.post(
  "/like-unlike",
  validate(likeUnlikeSchema),
  likeController.likeAndDislike,
);

likeRouter.get(
  "/list/:postId",
  validate(likeListSchema, REQUEST_OBJECT.PARAM),
  likeController.likeList,
);

export default likeRouter;
