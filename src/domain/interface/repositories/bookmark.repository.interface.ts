import { BookMark } from "@/domain/entities/bookmark.entity";

export interface IBookMarkRepository {
  get({
    userId,
    postId,
    limit,
    createdAt,
  }: {
    userId?: string;
    postId?: string;
    limit: number;
    createdAt?: Date;
  }): Promise<BookMark[]>;

  create(bookmark: BookMark): Promise<BookMark>;

  delete(userId: string, postId: string): Promise<BookMark>;
}
