import { ContentTypeEnum } from "@/domain/enum/post.enum";
import { ReportTypeEnum } from "@/domain/enum/report.enum";
import { Report } from "@/domain/entities/report.entity";
import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: Object.values(ReportTypeEnum), required: true },
    contentType: {
      type: String,
      enum: Object.values(ContentTypeEnum),
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ReportSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

ReportSchema.virtual("post", {
  ref: "Post",
  localField: "contentId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

ReportSchema.virtual("comment", {
  ref: "Comment",
  localField: "contentId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

export const ReportModel = mongoose.model<Report>("Report", ReportSchema);
