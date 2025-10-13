import Joi from "joi";

export const createWishListValidator = Joi.object({
  productId: Joi.string().required(),
}).required();

export const deleteWishListValidator = Joi.object({
  productId: Joi.string().required(),
}).required();

export const getWishListsValidator = Joi.object({
  createdAt: Joi.date().optional(),
}).optional();
