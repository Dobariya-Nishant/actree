import { injectable } from "tsyringe";
import { QueryOptions } from "mongoose";
import { NotificationModel } from "@/infrastructure/database/models/notification.model";
import { Notification } from "@/domain/entities/notification.entity";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { getObjectId } from "@/domain/helpers/util";

@injectable()
export class NotificationRepository {
  async get({
    userId,
    createdAt,
    isRead,
  }: {
    userId: string;
    createdAt?: Date;
    isRead?: boolean;
  }): Promise<Notification[]> {
    if (!userId) {
      throw new UnprocessableEntityError("userId is required for notification");
    }

    const query: QueryOptions = {};

    const userObjectId = getObjectId(userId);

    query["userId"] = userObjectId;

    query["createdAt"] = { $lte: createdAt || new Date() };

    query["isRead"] = isRead || false;

    const notification = await NotificationModel.find(query).sort({
      createdAt: -1,
    });

    return notification;
  }

  create(notification: Notification): Promise<Notification> {
    return NotificationModel.create(notification);
  }

  async update({
    userId,
    notificationId,
    update,
  }: {
    notificationId?: string;
    userId?: string;
    update: Partial<Notification>;
  }): Promise<void> {
    if (!notificationId && !userId) {
      throw new UnprocessableEntityError("notificationId or userId required");
    }
    if (notificationId) {
      const notificationObjectId = getObjectId(notificationId);

      await NotificationModel.findOneAndUpdate(
        {
          _id: notificationObjectId,
        },
        update,
        { new: true }
      );
    }

    const userObjectId = getObjectId(userId);

    await NotificationModel.updateMany(
      {
        userId: userObjectId,
      },
      update,
      { new: true }
    );
  }

  async delete(notificationId: string): Promise<Notification | null> {
    const notificationObjectId = getObjectId(notificationId);

    return NotificationModel.findOneAndDelete({
      _id: notificationObjectId,
    });
  }
}
