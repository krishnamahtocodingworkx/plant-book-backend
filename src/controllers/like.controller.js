import Like from "../models/Like.js";
import Post from "../models/Post.js";
import { errorResponse, successResponse } from "../utils/commonFunctions.js";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
  SuccessMessage,
} from "../utils/responseData.js";

const likeController = {
  likeAndDislike: async (req, res) => {
    try {
      const { userId, postId } = req.body;
      const likeExist = await Like.findOne({ userId: userId, postId: postId });
      if (likeExist) {
        await Like.findByIdAndDelete(likeExist._id);
        await Post.findOneAndUpdate(
          { _id: postId },
          {
            $inc: { likesCount: -1 },
          },
        );
      } else {
        await Like.create({
          userId: userId,
          postId: postId,
        });
        await Post.findOneAndUpdate(
          { _id: postId },
          {
            $inc: { likesCount: 1 },
          },
        );
      }

      return res
        .status(HttpStatusCode.CREATED)
        .json(
          successResponse(
            {},
            SuccessMessage.POST_LIKE_UPDATED,
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
  likeList: async (req, res) => {
    try {
      const { postId } = req.params;
      const likes = await Like.find({ postId: postId })
        .sort({ createdAt: -1 })
        .populate({
          path: "userId",
          select: {
            name: 1,
            profilePicture: 1,
          },
        });

      return res
        .status(HttpStatusCode.OK)
        .json(
          successResponse(
            likes,
            SuccessMessage.LIKE_LIST,
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

export default likeController;
