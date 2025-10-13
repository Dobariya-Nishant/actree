import { BookMark } from "@/domain/entities/bookmark.entity";

export interface IBookMarkService {
  get({
    userId,
    postId,
    token,
    limit,
    createdAt,
  }: {
    userId?: string;
    postId?: string;
    token?: string;
    limit: number;
    createdAt?: Date;
  }): Promise<BookMark[]>;

  create(bookmark: BookMark): Promise<BookMark>;

  delete(userId: string, postId: string): Promise<BookMark>;
}
