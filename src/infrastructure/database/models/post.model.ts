import mongoose, { Schema } from "mongoose";
import { Post } from "@/domain/entities/post.entity";
import { MediaSchema } from "@/infrastructure/database/models/media.model";

const PostSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    media: { type: [MediaSchema] },
    isEdited: { type: Boolean, default: false },
    isRePost: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    orignalPostId: { type: mongoose.Types.ObjectId, ref: "Post" },
    repostCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PostSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

PostSchema.virtual("isLiked", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId",
  justOne: true,
  limit: 1,
});

PostSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId",
  limit: 10,
});

PostSchema.virtual("isBookMarked", {
  ref: "BookMark",
  localField: "_id",
  foreignField: "postId",
  justOne: true,
  limit: 1,
});

PostSchema.index({ createdAt: -1, orignalPostId: 1 });

export const PostModel = mongoose.model<Post>("Post", PostSchema);
