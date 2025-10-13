import { container } from "tsyringe";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { NotificationController } from "@/api/controllers/notification.controller";
import {
  deleteNotificationValidator,
  getNotificationValidator,
  markAsReadNotificationValidator,
} from "@/api/validators/notification.validator";

const baseUrl = "/api/notification";

const notificationController = container.resolve<NotificationController>(
  "NotificationController"
);

const notificationRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getNotificationValidator,
      },
    },
    handler: notificationController.get.bind(notificationController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: markAsReadNotificationValidator,
      },
    },
    handler: notificationController.readed.bind(notificationController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deleteNotificationValidator,
      },
    },
    handler: notificationController.delete.bind(notificationController),
  },
];

export default {
  name: "notification-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of notificationRoutes) {
      server.route(route);
    }
  },
};
