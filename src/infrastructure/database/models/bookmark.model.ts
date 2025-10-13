import mongoose, { Schema } from "mongoose";
import { BookMark } from "@/domain/entities/bookmark.entity";

const BookMarkSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

BookMarkSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

BookMarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const BookMarkModel = mongoose.model<BookMark>(
  "BookMark",
  BookMarkSchema
);
