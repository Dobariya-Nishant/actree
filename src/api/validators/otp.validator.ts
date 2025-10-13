import { OtpTypeEnum } from "@/domain/enum/email.enum";
import Joi from "joi";

export const createOtpValidator = Joi.object({
  email: Joi.string().email().required(),
  type: Joi.string()
    .valid(...Object.values(OtpTypeEnum))
    .required(),
}).required();

export const getOtpValidator = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const verifyOtpValidator = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
}).required();

export const deleteOtpValidator = Joi.object({
  email: Joi.string().email().required(),
}).required();
