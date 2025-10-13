import { NotificationTypeEnum } from "@/domain/enum/notification.enum";

export interface Notification {
  _id: string;
  userId: string;
  message: string;
  isRead?: boolean;
  type: NotificationTypeEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
