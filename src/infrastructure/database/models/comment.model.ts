import mongoose, { Schema } from "mongoose";
import { Comment } from "@/domain/entities/comment.entity";
import { MediaSchema } from "@/infrastructure/database/models/media.model";

const CommentSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
    content: { type: String },
    isEdited: { type: Boolean, default: false },
    media: { type: [MediaSchema] },
  },
  { timestamps: true }
);

CommentSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

export const CommentModel = mongoose.model<Comment>("Comment", CommentSchema);
