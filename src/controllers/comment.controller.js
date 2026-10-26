import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { successResponse } from "../utils/commonFunctions.js";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
  SuccessMessage,
} from "../utils/responseData.js";

export const commentController = {
  addComment: async (req, res) => {
    try {
      const userId = req.user._id;
      const { comment, postId, parentCommentId } = req.body;
      console.log("parent comment id :", parentCommentId);
      const newComment = await Comment.create({
        comment,
        postId,
        userId,
        ...(parentCommentId && { parentCommentId }),
      });
      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { commentCount: 1 },
        },
      );
      if (parentCommentId) {
        await Comment.findOneAndUpdate(
          { _id: parentCommentId },
          { $inc: { replyCount: 1 } },
        );
      }
      return res
        .status(200)
        .json(
          successResponse(
            newComment,
            SuccessMessage.COMMENT_ADDED,
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
  getCommentList: async (req, res) => {
    try {
      const { postId, parentCommentId } = req.query;
      const query = {
        parentCommentId: parentCommentId ? parentCommentId : null,
        postId: postId,
      };
      const comments = await Comment.find(query).sort({ createdAt: -1 });
      return res
        .status(200)
        .json(
          successResponse(
            comments,
            SuccessMessage.COMMENT_LIST,
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

export default commentController;
