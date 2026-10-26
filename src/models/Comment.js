import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    replyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

CommentSchema.index({ postId: 1, parentCommentId: 1, createdAt: -1 });

export default mongoose.model("Comment", CommentSchema);
