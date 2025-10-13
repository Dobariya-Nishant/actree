import Joi from "joi";
import {
  AuthTypeEnum,
  GenderEnum,
  UserTypeEnum,
} from "@/domain/enum/user.enum";

function jsonParser(schema: Joi.ArraySchema) {
  //@ts-ignore
  return (value, helpers) => {
    try {
      const parsed = JSON.parse(value);
      const { error } = schema.validate(parsed);
      if (error) {
        throw error;
      }
      return parsed;
    } catch (err) {
      return helpers.error("any.invalid", { value });
    }
  };
}

export const socialLinkValidator = Joi.array()
  .items(
    Joi.object({
      url: Joi.string().required(),
      logoName: Joi.string().required(),
    }).required()
  )
  .required();

export const interestsValidator = Joi.array()
  .items(
    Joi.object({
      category: Joi.string().required(),
      interests: Joi.array().items(Joi.string().required()).required(),
    }).required()
  )
  .required();

export const individualUserSignUpValidator = Joi.object({
  type: Joi.string().valid(UserTypeEnum.INDIVIDUAL).required(),
  email: Joi.string().email().required(),
  userName: Joi.string().min(3).required(),
  fullName: Joi.string().min(3).required(),
  password: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  profilePicture: Joi.any().optional(),
  phoneNumber: Joi.string().optional(),
  gender: Joi.string()
    .valid(...Object.values(GenderEnum))
    .optional(),
  socialLinks: Joi.string()
    .custom(jsonParser(socialLinkValidator), "JSON Validation")
    .optional(),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().optional(),
  interests: Joi.string()
    .custom(jsonParser(interestsValidator), "JSON Validation")
    .optional(),
}).required();

export const businessUserSignUpValidator = Joi.object({
  type: Joi.string().valid(UserTypeEnum.BUSINESS).required(),
  email: Joi.string().email().required(),
  userName: Joi.string().min(3).required(),
  businessName: Joi.string().max(255).required(),
  password: Joi.string().required(),
  address: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  websiteUrl: Joi.string().optional(),
  profilePicture: Joi.any().optional(),
  industry: Joi.string().optional(),
  businessCategory: Joi.string().max(255).optional(),
  operatingHours: Joi.string().optional(),
  bio: Joi.string().max(500).optional(),
  socialLinks: Joi.string()
    .custom(jsonParser(socialLinkValidator), "JSON Validation")
    .optional(),
  aboutCompany: Joi.string().optional(),
  interests: Joi.string()
    .custom(jsonParser(interestsValidator), "JSON Validation")
    .optional(),
}).required();

export const userSignUpValidator = Joi.object({
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
})
  .when(
    Joi.object({
      type: Joi.valid(UserTypeEnum.INDIVIDUAL).required(),
    }).unknown(),
    {
      then: individualUserSignUpValidator,
    }
  )
  .when(
    Joi.object({ type: Joi.valid(UserTypeEnum.BUSINESS).required() }).unknown(),
    {
      then: businessUserSignUpValidator,
    }
  );

export const individualUserUpdateValidator = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
  userName: Joi.string().min(3).optional(),
  fullName: Joi.string().min(3).optional(),
  dateOfBirth: Joi.date().optional(),
  profilePicture: Joi.any().optional(),
  isPrivate: Joi.bool().optional(),
  phoneNumber: Joi.string().optional(),
  gender: Joi.string()
    .valid(...Object.values(GenderEnum))
    .optional(),
  socialLinks: Joi.string()
    .custom(jsonParser(socialLinkValidator), "JSON Validation")
    .optional(),
  operatingHours: Joi.string().optional(),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().optional(),
  interests: Joi.string()
    .custom(jsonParser(interestsValidator), "JSON Validation")
    .optional(),
}).required();

export const businessUserUpdateValidator = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
  userName: Joi.string().min(3).optional(),
  businessName: Joi.string().max(255).optional(),
  isPrivate: Joi.bool().optional(),
  address: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  websiteUrl: Joi.string().optional(),
  profilePicture: Joi.any().optional(),
  industry: Joi.string().optional(),
  businessCategory: Joi.string().max(255).optional(),
  bio: Joi.string().max(500).optional(),
  socialLinks: Joi.string()
    .custom(jsonParser(socialLinkValidator), "JSON Validation")
    .optional(),
  operatingHours: Joi.string().optional(),
  aboutCompany: Joi.string().optional(),
  location: Joi.string().optional(),
  interests: Joi.string()
    .custom(jsonParser(interestsValidator), "JSON Validation")
    .optional(),
}).required();

export const userUpdateValidator = Joi.object({
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
})
  .when(
    Joi.object({
      type: Joi.valid(UserTypeEnum.INDIVIDUAL).required(),
    }).unknown(),
    {
      then: individualUserUpdateValidator,
    }
  )
  .when(
    Joi.object({ type: Joi.valid(UserTypeEnum.BUSINESS).required() }).unknown(),
    {
      then: businessUserUpdateValidator,
    }
  );

export const getUsersValidator = Joi.object({
  userIds: Joi.array().items(Joi.string().required()).optional(),
  createdAt: Joi.date().optional(),
}).optional();

export const getUserProfileValidator = Joi.object({
  email: Joi.string().email().optional(),
  userName: Joi.string().optional(),
  userId: Joi.string().optional(),
})
  .required()
  .or("email", "userName", "userId");

export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).required();

export const oAuthCallBackValidator = Joi.object({
  code: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
  authType: Joi.string()
    .valid(...Object.values(AuthTypeEnum))
    .required(),
})
  .required()
  .unknown(true);

export const oAuthValidator = Joi.object({
  authType: Joi.string()
    .valid(...Object.values(AuthTypeEnum))
    .required(),
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
}).required();

export const resetPasswordValidator = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().required(),
}).required();

export const deleteUserValidator = Joi.object({
  userId: Joi.string().optional(),
  email: Joi.string().email().optional(),
})
  .required()
  .or("email", "userId");
