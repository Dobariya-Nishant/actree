import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { otpSuccess } from "@/domain/messages/success/otp.message";
import { NotificationService } from "@/domain/service/notification.service";
import { Notification } from "@/domain/entities/notification.entity";

@injectable()
export class NotificationController {
  constructor(
    @inject("NotificationService")
    private notificationService: NotificationService
  ) {}

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;
    const { credentials: user } = request.auth as any;

    const notifications = await this.notificationService.get({
      userId: user._id,
      createdAt: query.createdAt,
      isRead: query.isRead,
    });

    return h
      .response({
        statusCode: 200,
        data: notifications,
        message: otpSuccess.VERIFYED,
      })
      .code(200);
  }

  // async create(
  //   request: Request<ReqRefDefaults>,
  //   h: ResponseToolkit<ReqRefDefaults>
  // ) {
  //   const body = request.payload as any;
  //   const { credentials: user } = request.auth as any;

  //   return h
  //     .response({
  //       statusCode: 201,
  //       data: {},
  //       message: otpSuccess.SENT,
  //     })
  //     .code(201);
  // }

  async readed(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const notification: Partial<Notification> = {
      isRead: true,
    };

    const notificationUpdate = await this.notificationService.update({
      notificationId: body.notificationId,
      userId: user._id,
      update: notification,
    });

    return h
      .response({
        statusCode: 201,
        data: notificationUpdate,
        message: otpSuccess.VERIFYED,
      })
      .code(201);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    return h
      .response({
        statusCode: 201,
        data: {},
        message: otpSuccess.DLETED,
      })
      .code(201);
  }
}
