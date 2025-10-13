import Joi from "joi";
import { mediaValidator } from "@/api/validators/media.validator";

export const createRePostValidator = Joi.object({
  orignalPostId: Joi.string().required(),
  content: Joi.string().optional(),
  media: mediaValidator.optional(),
}).or("content", "media");

export const updateRePostValidator = Joi.object({
  postId: Joi.string().required(),
  content: Joi.string().optional(),
  media: mediaValidator.optional(),
}).or("content", "media");

export const getRePostsValidator = Joi.object({
  postId: Joi.string().optional(),
  createdAt: Joi.date().optional(),
}).optional();

export const deleteRePostValidator = Joi.object({
  postId: Joi.string().required(),
}).required();
