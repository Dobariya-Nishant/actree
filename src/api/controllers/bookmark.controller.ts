import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { generateObjectId } from "@/domain/helpers/util";
import { BookMark } from "@/domain/entities/bookmark.entity";
import { IBookMarkService } from "@/domain/interface/service/bookmark.service.interface";
import { bookMarkSuccess } from "@/domain/messages/success/bookmark.message";

@injectable()
export class BookMarkController {
  constructor(
    @inject("BookMarkService") private bookMarkService: IBookMarkService
  ) {}

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;
    const { credentials: user } = request.auth as any;

    const bookMarkList = await this.bookMarkService.get({
      userId: user._id,
      //@ts-ignore
      token: request?.auth?.token,
      createdAt: query.createdAt,
      limit: 10,
    });

    const bookMark = bookMarkList[bookMarkList.length - 1];

    const bookMarks = {
      commentList: bookMarkList,
      createdAt: bookMark.createdAt,
    };

    return h
      .response({
        statusCode: 200,
        data: bookMarks,
        message: bookMarkSuccess.SENT_BOOKMARKS,
      })
      .code(200);
  }

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const bookMark: BookMark = {
      //@ts-ignore
      _id: generateObjectId(),
      userId: user._id,
      postId: body.postId,
    };

    const newBookMark = await this.bookMarkService.create(bookMark);

    return h
      .response({
        statusCode: 201,
        data: newBookMark,
        message: bookMarkSuccess.CREATED,
      })
      .code(201);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    await this.bookMarkService.delete(user._id, body.postId);

    return h
      .response({
        statusCode: 200,
        message: bookMarkSuccess.DLETED,
      })
      .code(200);
  }
}
