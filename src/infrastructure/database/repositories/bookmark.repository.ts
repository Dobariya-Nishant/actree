import { injectable } from "tsyringe";
import { BookMark } from "@/domain/entities/bookmark.entity";
import { IBookMarkRepository } from "@/domain/interface/repositories/bookmark.repository.interface";
import { getObjectId } from "@/domain/helpers/util";
import { NotFoundError } from "@/domain/errors/app-errors";
import { bookMarkError } from "@/domain/messages/error/bookmark.error";
import { BookMarkModel } from "@/infrastructure/database/models/bookmark.model";

@injectable()
export class BookMarkRepository implements IBookMarkRepository {
  async get({
    userId,
    postId,
    limit,
    createdAt,
  }: {
    userId?: string;
    postId?: string;
    limit: number;
    createdAt?: Date;
  }): Promise<BookMark[]> {
    const filter: Record<string, any> = {};

    if (postId) {
      filter.postId = getObjectId(postId);
    }

    if (userId) {
      filter.userId = getObjectId(userId);
    }

    filter.createdAt = { $lt: createdAt || new Date() };

    const bookmarks = await BookMarkModel.find(filter)
      .limit(limit)
      .populate("postId")
      .populate("user")
      .sort({ createdAt: -1 })
      .lean();

    if (!bookmarks.length) {
      throw new NotFoundError(bookMarkError.BOOKMARK_NOT_FOUND);
    }

    return bookmarks;
  }

  create(bookmark: BookMark): Promise<BookMark> {
    return BookMarkModel.create(bookmark);
  }

  async delete(userId: string, postId: string): Promise<BookMark> {
    const postObjectId = getObjectId(postId);
    const userObjectId = getObjectId(userId);

    const bookmark = await BookMarkModel.findOneAndDelete({
      postId: postObjectId,
      userId: userObjectId,
    });

    if (!bookmark) {
      throw new NotFoundError(bookMarkError.NOT_FOUND);
    }

    return bookmark;
  }
}
