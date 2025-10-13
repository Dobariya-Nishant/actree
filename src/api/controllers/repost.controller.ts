import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { Post } from "@/domain/entities/post.entity";
import { generateObjectId } from "@/domain/helpers/util";
import { postSuccess } from "@/domain/messages/success/post.message";
import { IRePostService } from "@/domain/interface/repositories/repost.repository.interface";

@injectable()
export class RePostController {
  constructor(@inject("PostService") private rePostService: IRePostService) {}

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

    const newPost = await this.rePostService.create(post);

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
    };

    const updatedPost = await this.rePostService.update(body.postId, post);

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

    if (query.postId) {
      const post = await this.rePostService.getOne(query.postId);

      return h
        .response({
          statusCode: 200,
          data: post,
          message: postSuccess.SENT,
        })
        .code(200);
    }

    const postList = await this.rePostService.get(query.createdAt);

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

    const deletedPost = await this.rePostService.delete(body.postId);

    return h
      .response({
        statusCode: 204,
        message: postSuccess.DLETED,
      })
      .code(204);
  }
}
