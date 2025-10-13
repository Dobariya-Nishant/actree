import Joi from "joi";
import { mediaValidator } from "@/api/validators/media.validator";

export const createCommentValidator = Joi.object({
  postId: Joi.string().required(),
  content: Joi.string().optional(),
  media: mediaValidator.optional(),
}).or("content", "media");

export const updateCommentValidator = Joi.object({
  commentId: Joi.string().required(),
  content: Joi.string().optional(),
  media: mediaValidator.optional(),
}).or("content", "media");

export const getCommentsValidator = Joi.object({
  postId: Joi.string().optional(),
  userId: Joi.string().optional(),
  createdAt: Joi.date().optional(),
}).optional();

export const deleteCommentValidator = Joi.object({
  commentId: Joi.string().required(),
}).required();
