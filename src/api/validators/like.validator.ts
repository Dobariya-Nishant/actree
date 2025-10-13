import Joi from "joi";

export const createLikeValidator = Joi.object({
  postId: Joi.string().required(),
}).required();

export const getLikesValidator = Joi.object({
  postId: Joi.string().optional(),
  userId: Joi.string().optional(),
  createdAt: Joi.date().optional(),
}).optional();

export const deleteLikeValidator = Joi.object({
  postId: Joi.string().required(),
}).required();
