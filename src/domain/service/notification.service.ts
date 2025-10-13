import { inject, injectable } from "tsyringe";
import { Notification } from "@/domain/entities/notification.entity";
import { NotificationRepository } from "@/infrastructure/database/repositories/notificatin.repository";
import { NotFoundError } from "@/domain/errors/app-errors";
import { generateObjectId } from "@/domain/helpers/util";
import { NotificationTypeEnum } from "@/domain/enum/notification.enum";
import { SocketService } from "./socket.service";

@injectable()
export class NotificationService {
  constructor(
    @inject("NotificationRepository")
    private notificationRepository: NotificationRepository,
    @inject("SocketService")
    private socketService: SocketService
  ) {}
  async get({
    userId,
    createdAt,
    isRead,
  }: {
    userId: string;
    isRead?: boolean;
    createdAt?: Date;
  }): Promise<Notification[]> {
    const notifications = await this.notificationRepository.get({
      userId,
      isRead,
      createdAt,
    });

    if (!notifications.length) {
      throw new NotFoundError("notifications not found");
    }

    return notifications;
  }

  async create(
    userId: string,
    message: string,
    type: NotificationTypeEnum
  ): Promise<Notification> {
    const notification: Notification = {
      //@ts-ignore
      _id: generateObjectId(),
      userId,
      message,
      type,
    };

    const newNotification = await this.notificationRepository.create(
      notification
    );

    this.socketService.sendNotification(newNotification);

    return newNotification;
  }

  async update({
    notificationId,
    userId,
    update,
  }: {
    notificationId: string;
    userId: string;
    update: Partial<Notification>;
  }): Promise<void> {
    return this.notificationRepository.update({
      notificationId,
      userId,
      update,
    });
  }

  async delete(notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepository.delete(
      notificationId
    );

    if (!notification) {
      throw new NotFoundError("notification not found");
    }

    return notification;
  }
}
