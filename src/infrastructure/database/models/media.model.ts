import mongoose, { Schema } from "mongoose";
import { MediaTypeEnum } from "@/domain/enum/user.enum";

export const MediaSchema: Schema = new Schema(
  {
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
    productId: { type: mongoose.Types.ObjectId, ref: "Product" }, // Assuming "Product" instead of "Post"
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: Object.values(MediaTypeEnum), required: true },
    url: { type: String },
  },
  {
    timestamps: true,
    validate: {
      //@ts-ignore
      validator: function () {
        //@ts-ignore
        return this.postId || this.productId;
      },
      message: "Either postId or productId must be provided",
    },
  }
);
