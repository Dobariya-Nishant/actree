import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { generateObjectId } from "@/domain/helpers/util";
import { Like } from "@/domain/entities/like.entity";
import { ILikeService } from "@/domain/interface/service/like.service.interface";
import { likeSuccess } from "@/domain/messages/success/like.message";

@injectable()
export class LikeController {
  constructor(@inject("LikeService") private likeService: ILikeService) {}

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const like: Like = {
      //@ts-ignore
      _id: generateObjectId(),
      userId: user._id,
      postId: body.postId,
    };

    const newLike = await this.likeService.create(like);

    return h
      .response({
        statusCode: 201,
        data: newLike,
        message: likeSuccess.CREATED,
      })
      .code(201);
  }

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;

    const likeList = await this.likeService.get({
      postId: query.postId,
      userId: query.userId,
      createdAt: query.createdAt,
      limit: 10,
    });

    const like = likeList[likeList.length - 1];

    const likes = {
      commentList: likeList,
      createdAt: like.createdAt,
    };

    return h
      .response({
        statusCode: 200,
        data: likes,
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

    await this.likeService.delete(body.postId, user._id);

    return h
      .response({
        statusCode: 201,
        message: likeSuccess.DLETED,
      })
      .code(201);
  }
}
