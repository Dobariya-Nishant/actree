import Joi from "joi";

export const checkOutValidator = Joi.object({
  productId: Joi.string().required(),
  tipAmount: Joi.string().optional(),
}).required();

// export const deleteWishListValidator = Joi.object({
//   productId: Joi.string().required(),
// }).required();

export const getTransactionsValidator = Joi.object({
  buyerId: Joi.string().optional(),
  sellerId: Joi.string().optional(),
  transactionId: Joi.string().optional(),
  createdAt: Joi.date().optional(),
}).or("buyerId", "sellerId", "transactionId");

export const getAnalyticsValidator = Joi.object({
  // chartType: Joi.string()
  //   .valid(...Object.values(ChartTypeEnum))
  //   .optional(),
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional(),
  year: Joi.string().optional(),
}).with("fromDate", "toDate");
