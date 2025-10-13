import Joi from "joi";

export const getNotificationValidator = Joi.object({
  isRead: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
}).optional();

export const markAsReadNotificationValidator = Joi.object({
  notificationId: Joi.string().optional(),
}).optional();

export const deleteNotificationValidator = Joi.object({
  notificationId: Joi.string().required(),
}).required();
