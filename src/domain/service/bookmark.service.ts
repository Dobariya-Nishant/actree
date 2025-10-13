import { inject, injectable } from "tsyringe";
import { BookMark } from "@/domain/entities/bookmark.entity";
import { IBookMarkService } from "@/domain/interface/service/bookmark.service.interface";
import { IBookMarkRepository } from "@/domain/interface/repositories/bookmark.repository.interface";

@injectable()
export class BookMarkService implements IBookMarkService {
  constructor(
    @inject("BookMarkRepository")
    private bookMarkRepository: IBookMarkRepository
  ) {}

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
    const bookMarks = await this.bookMarkRepository.get({
      userId,
      postId,
      limit,
      createdAt,
    });

    return bookMarks;
  }

  create(bookmark: BookMark): Promise<BookMark> {
    return this.bookMarkRepository.create(bookmark);
  }

  delete(userId: string, postId: string): Promise<BookMark> {
    return this.bookMarkRepository.delete(userId, postId);
  }
}
