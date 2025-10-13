import mongoose, { Schema } from "mongoose";
import { Like } from "@/domain/entities/like.entity";

const LikeSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

LikeSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const LikeModel = mongoose.model<Like>("Like", LikeSchema);
