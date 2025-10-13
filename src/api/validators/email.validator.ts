import Joi from "joi";

export const emailValidator = Joi.object({
  toEmail: Joi.string().required(),
  subject: Joi.string().required(),
  text: Joi.string().required(),
});
