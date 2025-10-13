import mongoose, { Schema, Document } from "mongoose";
import { WishList } from "@/domain/entities/wishlist.entity";

const WishlistSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WishlistSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const WishListModel = mongoose.model<WishList & Document>(
  "WishList",
  WishlistSchema
);

export default WishListModel;
