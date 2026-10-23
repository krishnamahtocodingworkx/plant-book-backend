import Post from "../models/Post.js";
import { errorResponse, successResponse } from "../utils/commonFunctions.js";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
  SuccessMessage,
} from "../utils/responseData.js";

// Controller for creating a new post
const PostController = {
  addNewPost: async (req, res) => {
    try {
      const { content, media = [] } = req.body;

      const newPost = await Post.create({
        content,
        media,
        userId: req.user._id,
      });

      return res
        .status(HttpStatusCode.CREATED)
        .json(
          successResponse(
            newPost,
            SuccessMessage.POST_CREATED,
            HttpStatusMessage.CREATED,
            HttpStatusCode.CREATED,
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          errorResponse(
            error,
            ExceptionMessage.INTERNAL_SERVER_ERROR,
            HttpStatusMessage.INTERNAL_SERVER_ERROR,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },
  getMyAllPosts: async (req, res) => {
    try {
      const { userId } = req.params;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const post = await Post.find({ userId: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      return res
        .status(HttpStatusCode.ACCEPTED)
        .json(
          successResponse(
            post,
            SuccessMessage.USER_PROFILE_POST,
            HttpStatusMessage.OK,
            HttpStatusCode.OK,
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          errorResponse(
            error,
            ExceptionMessage.INTERNAL_SERVER_ERROR,
            HttpStatusMessage.INTERNAL_SERVER_ERROR,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },
};

export default PostController;
