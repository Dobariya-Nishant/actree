import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { likeSuccess } from "@/domain/messages/success/like.message";
import { IPinService } from "@/domain/interface/service/pin.service.interface";

@injectable()
export class PinController {
  constructor(@inject("PinService") private pinService: IPinService) {}

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const pin = await this.pinService.create({
      userId: user._id,
      postId: body.postId,
    });

    return h
      .response({
        statusCode: 201,
        data: pin,
        message: likeSuccess.CREATED,
      })
      .code(201);
  }

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;
    const { credentials: user } = request.auth as any;

    const pin = await this.pinService.get({
      userId: user._id,
      queryUserId: query.userId,
    });

    return h
      .response({
        statusCode: 200,
        data: pin,
        message: likeSuccess.SENT_LIKES,
      })
      .code(200);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    await this.pinService.delete({
      userId: user._id,
      postId: body.postId,
    });

    return h
      .response({
        statusCode: 201,
        message: likeSuccess.DLETED,
      })
      .code(201);
  }
}
