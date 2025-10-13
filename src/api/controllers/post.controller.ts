import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { IPostService } from "@/domain/interface/service/post.service.interface";
import { Post } from "@/domain/entities/post.entity";
import { generateObjectId } from "@/domain/helpers/util";
import { postSuccess } from "@/domain/messages/success/post.message";
import { RoleTypeEnum, UserTypeEnum } from "@/domain/enum/user.enum";

@injectable()
export class PostController {
  constructor(@inject("PostService") private postService: IPostService) {}

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const post: Post = {
      //@ts-ignore
      _id: generateObjectId(),
      userId: user._id,
      ...(body.content && { content: body.content }),
      ...(body.media && { media: body.media }),
      ...(body.orignalPostId && { orignalPostId: body.orignalPostId }),
    };

    const newPost = await this.postService.create(post);

    return h
      .response({
        statusCode: 201,
        data: newPost,
        message: postSuccess.CREATED,
      })
      .code(201);
  }

  async update(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const post: Partial<Post> = {
      ...(body.content && { content: body.content }),
      ...(body.media && { media: body.media }),
      ...(body.isDeleted && { isDeleted: body.isDeleted }),
    };

    const updatedPost = await this.postService.update(body.postId, post);

    return h
      .response({
        statusCode: 201,
        data: updatedPost,
        message: postSuccess.UPDATE,
      })
      .code(201);
  }

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;
    const { credentials: user } = request.auth as any;

    if (query.postId) {
      const post = await this.postService.getOne(query.postId);

      return h
        .response({
          statusCode: 200,
          data: post,
          message: postSuccess.SENT,
        })
        .code(200);
    }

    const postList = await this.postService.get({
      ...(query.isDeleted &&
        user.role === RoleTypeEnum.ADMIN && { isDeleted: query.isDeleted }),
      createdAt: query.createdAt,
      //@ts-ignore
      token: request?.auth?.token,
      userId: user._id,
      queryUserId: query?.userId,
    });

    const post = postList[postList.length - 1];

    const posts = {
      postList: postList,
      createdAt: post.createdAt,
    };

    return h
      .response({
        statusCode: 200,
        data: posts,
        message: postSuccess.SENT_POSTS,
      })
      .code(200);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    await this.postService.delete(body.postId);

    return h
      .response({
        statusCode: 200,
        message: postSuccess.DLETED,
      })
      .code(200);
  }
}
