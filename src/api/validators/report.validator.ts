import Joi from "joi";
import { ContentTypeEnum } from "@/domain/enum/post.enum";
import { ReportTypeEnum } from "@/domain/enum/report.enum";

export const createReportValidator = Joi.object({
  contentId: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(ReportTypeEnum))
    .optional(),
  contentType: Joi.string()
    .valid(...Object.values(ContentTypeEnum))
    .optional(),
});

export const updateReportValidator = Joi.object({
  reportId: Joi.string().required(),
  contentId: Joi.string().optional(),
  type: Joi.string()
    .valid(...Object.values(ReportTypeEnum))
    .optional(),
  contentType: Joi.string()
    .valid(...Object.values(ContentTypeEnum))
    .optional(),
}).required();

export const getReportsValidator = Joi.object({
  type: Joi.string()
    .valid(...Object.values(ReportTypeEnum))
    .optional(),
  contentType: Joi.string()
    .valid(...Object.values(ContentTypeEnum))
    .optional(),
  createdAt: Joi.date().optional(),
}).optional();

export const getReportsCountValidator = Joi.object({
  type: Joi.string()
    .valid(...Object.values(ReportTypeEnum))
    .optional(),
  contentType: Joi.string()
    .valid(...Object.values(ContentTypeEnum))
    .optional(),
  userId: Joi.string().optional(),
}).optional();

export const deleteReportValidator = Joi.object({
  reportId: Joi.string().required(),
}).required();
