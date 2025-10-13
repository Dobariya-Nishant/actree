import { Notification } from "@/domain/entities/notification.entity";
import { NotificationTypeEnum } from "@/domain/enum/notification.enum";
import mongoose, { Schema } from "mongoose";

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    message: { type: String },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: NotificationTypeEnum },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<Notification>(
  "Notification",
  NotificationSchema
);
