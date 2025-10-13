import Joi from "joi";

export const createPinValidator = Joi.object({
  postId: Joi.string().required(),
}).required();

export const getPinsValidator = Joi.object({
  userId: Joi.string().required(),
}).optional();

export const deletePinValidator = Joi.object({
  postId: Joi.string().required(),
}).required();
