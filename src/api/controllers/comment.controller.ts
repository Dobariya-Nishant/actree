import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { generateObjectId } from "@/domain/helpers/util";
import { ICommentService } from "@/domain/interface/service/comment.service.interface";
import { Comment } from "@/domain/entities/comment.entity";
import { commentSuccess } from "@/domain/messages/success/comment.message";

@injectable()
export class CommentController {
  constructor(
    @inject("CommentService") private commentService: ICommentService
  ) {}

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const comment: Comment = {
      //@ts-ignore
      _id: generateObjectId(),
      userId: user._id,
      content: body.content,
      postId: body.postId,
      media: body.media,
    };

    const newPost = await this.commentService.create(comment);

    return h
      .response({
        statusCode: 201,
        data: newPost,
        message: commentSuccess.CREATED,
      })
      .code(201);
  }

  async update(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const comment: Partial<Comment> = {
      content: body.content,
      media: body.media,
    };

    const updatedPost = await this.commentService.update(
      body.commentId,
      comment
    );

    return h
      .response({
        statusCode: 201,
        data: updatedPost,
        message: commentSuccess.UPDATE,
      })
      .code(201);
  }

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;

    const commentList = await this.commentService.get({
      postId: query.postId,
      userId: query.userId,
      createdAt: query.createdAt,
      limit: 10,
    });

    const comment = commentList[commentList.length - 1];

    const comments = {
      commentList: commentList,
      createdAt: comment.createdAt,
    };

    return h
      .response({
        statusCode: 200,
        data: comments,
        message: commentSuccess.SENT_COMMENTS,
      })
      .code(200);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    await this.commentService.delete(body.commentId);

    return h
      .response({
        statusCode: 201,
        message: commentSuccess.DLETED,
      })
      .code(201);
  }
}
