import { FollowTypeEnum } from "@/domain/enum/user.enum";
import Joi from "joi";

export const createFollowValidator = Joi.object({
  followedId: Joi.string().required(),
}).required();

export const acceptFollowValidator = Joi.object({
  followId: Joi.string().required(),
}).required();

export const getFollowValidator = Joi.object({
  type: Joi.string()
    .valid(...Object.values(FollowTypeEnum))
    .required(),
});

export const deleteFollowValidator = Joi.object({
  followedId: Joi.string().required(),
}).required();
