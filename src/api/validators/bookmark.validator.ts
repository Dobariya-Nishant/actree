import Joi from "joi";

export const createBookMarkValidator = Joi.object({
  postId: Joi.string().required(),
}).required();

export const getBookMarksValidator = Joi.object({
  postId: Joi.string().optional(),
  userId: Joi.string().optional(),
  createdAt: Joi.date().optional(),
}).optional();

export const deleteBookMarkValidator = Joi.object({
  postId: Joi.string().required(),
}).required();
