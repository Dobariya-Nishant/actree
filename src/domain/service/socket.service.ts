import { injectable } from "tsyringe";
import { getSocket } from "@/infrastructure/web-socket/socket";
import { Notification } from "../entities/notification.entity";

@injectable()
export class SocketService {
  async sendNotification(notification: Notification): Promise<void> {
    const socket = getSocket();

    socket
      .to(notification?.userId?.toString())
      .emit("notification", notification);
  }
}
