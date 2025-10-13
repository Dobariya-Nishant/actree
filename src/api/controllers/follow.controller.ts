import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { IFollowService } from "@/domain/interface/service/follow.service.interface";
import { followSuccess } from "@/domain/messages/success/follow.message";

@injectable()
export class FollowController {
  constructor(
    @inject("FollowService")
    private followService: IFollowService
  ) {}

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;
    const { credentials: user } = request.auth as any;

    const data = await this.followService.get(
      query.type,
      user._id,
      query.createdAt
    );

    return h
      .response({
        statusCode: 200,
        data: data,
        ...(data.followers && { message: followSuccess.SENT_FOLLOWERS }),
        ...(data.followings && { message: followSuccess.SENT_FOLLOWINGS }),
        ...(data.requested && { message: followSuccess.SENT_REQUESTED }),
      })
      .code(200);
  }

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const { data, message } = await this.followService.followOrRequest(
      user._id,
      body.followedId
    );

    return h
      .response({
        statusCode: 201,
        data: data,
        message: message,
      })
      .code(201);
  }

  async accept(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const follow = await this.followService.accept(body.followId);

    return h
      .response({
        statusCode: 201,
        data: follow,
        message: followSuccess.FOLLOWED,
      })
      .code(201);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const deletedFollow = await this.followService.delete(
      user._id,
      body.followedId
    );

    return h
      .response({
        statusCode: 201,
        data: deletedFollow,
        message: followSuccess.UN_FOLLOWED,
      })
      .code(201);
  }
}
