import Joi from "joi";
import { mediaValidator } from "@/api/validators/media.validator";

export const createPostValidator = Joi.object({
  orignalPostId: Joi.string().optional(),
  content: Joi.string().optional(),
  media: mediaValidator.optional(),
}).or("orignalPostId", "content", "media");

export const updatePostValidator = Joi.object({
  postId: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
  content: Joi.string().optional(),
  media: mediaValidator.optional(),
}).or("content", "media");

export const getPostsValidator = Joi.object({
  isDeleted: Joi.boolean().optional(),
  userId: Joi.string().optional(),
  postId: Joi.string().optional(),
  createdAt: Joi.date().optional(),
}).optional();

export const deletePostValidator = Joi.object({
  postId: Joi.string().required(),
}).required();
