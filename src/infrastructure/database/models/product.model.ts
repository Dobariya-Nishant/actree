import mongoose, { Schema, Document } from "mongoose";
import { Product } from "@/domain/entities/product.entity";
import { MediaSchema } from "@/infrastructure/database/models/media.model";
import { ProductStatusEnum } from "@/domain/enum/product.enum";

// Product schema definition with additional fields
const ProductSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    platformFee: { type: String, required: true }, // New field
    isDeleted: { type: Boolean, default: false },
    isCustomCategory: { type: Boolean, default: false },
    formate: { type: String }, // New field (optional)
    sellerReceive: { type: String }, // New field
    size: { type: String }, // New field (optional)
    dimension: { type: String }, // New field (optional)
    frameRate: { type: String }, // New field (optional)
    resolution: { type: String }, // New field (optional)
    itemPartNumber: { type: String }, // New field (optional)
    countryOfOrigin: { type: String }, // New field (optional)
    fontFor: { type: String }, // New field (optional)
    tags: { type: [String] }, // New field (optional)
    name: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ProductStatusEnum),
      default: ProductStatusEnum.PENDING,
    },
    platform: { type: String },
    description: { type: String },
    displayMedia: [MediaSchema],
    orignalMedia: [MediaSchema],
    profilePicture: { type: MediaSchema }, // Assuming it's a single media object, not an array
    authorAbout: { type: String }, // New field (optional)
    authorName: { type: String }, // New field (optional)
    publisher: { type: String }, // New field (optional)
    publishedDate: { type: Date }, // New field (optional)
    language: { type: String }, // New field (optional)
    noOfExercises: { type: String }, // New field (optional)
    noOfArticles: { type: String }, // New field (optional)
    printLength: { type: String }, // New field (optional)
    compatibleBrowsers: { type: [String] }, // New field (optional)
    layout: { type: String }, // New field (optional)
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("seller", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

ProductSchema.virtual("isPurchased", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "productId",
  justOne: true,
  limit: 1,
});

ProductSchema.virtual("isWishlist", {
  ref: "WishList",
  localField: "_id",
  foreignField: "productId",
  justOne: true,
  limit: 1,
});

const ProductModel = mongoose.model<Product & Document>(
  "Product",
  ProductSchema
);

export default ProductModel;
