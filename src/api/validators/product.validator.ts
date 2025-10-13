import Joi from "joi";
import {
  CategoryTypeEnum,
  ProductStatusEnum,
} from "@/domain/enum/product.enum";
import { mediaValidator } from "@/api/validators/media.validator";

export const createProductValidator = Joi.object({
  category: Joi.string().required(),
  price: Joi.string().required(),
  platformFee: Joi.string().optional(),
  sellerReceive: Joi.string().optional(),
  formate: Joi.string().optional(),
  size: Joi.string().optional(),
  dimension: Joi.string().optional(),
  frameRate: Joi.string().optional(),
  resolution: Joi.string().optional(),
  itemPartNumber: Joi.string().optional(),
  countryOfOrigin: Joi.string().optional(),
  fontFor: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  name: Joi.string().required(),
  platform: Joi.string().optional(),
  description: Joi.string().optional(),
  displayMedia: mediaValidator.required(),
  orignalMedia: mediaValidator.required(),
  profilePicture: mediaValidator.optional(),
  authorAbout: Joi.string().optional(),
  authorName: Joi.string().optional(),
  publisher: Joi.string().optional(),
  publishedDate: Joi.date().optional(),
  language: Joi.string().optional(),
  noOfExercises: Joi.string().optional(),
  noOfArticles: Joi.string().optional(),
  printLength: Joi.string().optional(),
  compatibleBrowsers: Joi.array().items(Joi.string()).optional(),
  layout: Joi.string().optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

export const updateProductValidator = Joi.object({
  productId: Joi.string().required(),
  category: Joi.string()
    .valid(...Object.values(CategoryTypeEnum))
    .optional(),
  price: Joi.string().optional(),
  platformFee: Joi.string().optional(),
  sellerReceive: Joi.string().optional(),
  formate: Joi.string().optional(),
  size: Joi.string().optional(),
  dimension: Joi.string().optional(),
  frameRate: Joi.string().optional(),
  resolution: Joi.string().optional(),
  itemPartNumber: Joi.string().optional(),
  countryOfOrigin: Joi.string().optional(),
  fontFor: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  name: Joi.string().optional(),
  platform: Joi.string().optional(),
  description: Joi.string().optional(),
  displayMedia: mediaValidator.optional(),
  orignalMedia: mediaValidator.optional(),
  profilePicture: mediaValidator.optional(),
  authorAbout: Joi.string().optional(),
  authorName: Joi.string().optional(),
  publisher: Joi.string().optional(),
  publishedDate: Joi.date().optional(),
  language: Joi.string().optional(),
  noOfExercises: Joi.string().optional(),
  noOfArticles: Joi.string().optional(),
  printLength: Joi.string().optional(),
  compatibleBrowsers: Joi.array().items(Joi.string()).optional(),
  layout: Joi.string().optional(),
  updatedAt: Joi.date().optional(),
});

export const updateProductStatusValidator = Joi.object({
  productId: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatusEnum))
    .required(),
});

export const deleteProductValidator = Joi.object({
  productId: Joi.string().required(),
}).required();

export const getProductsValidator = Joi.object({
  isDeleted: Joi.boolean().optional(),
  isCustomCategory: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
  sellerId: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatusEnum))
    .optional(),
  category: Joi.string()
    .valid(...Object.values(CategoryTypeEnum))
    .optional(),
  search: Joi.string().optional(),
  productId: Joi.string().optional(),
  price: Joi.number().optional(),
}).required();
