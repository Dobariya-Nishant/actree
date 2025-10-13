import { Like } from "@/domain/entities/like.entity";

export interface ILikeRepository {
  get({
    postId,
    userId,
    createdAt,
    limit,
  }: {
    postId?: string;
    userId?: string;
    createdAt?: Date;
    limit: number;
  }): Promise<Like[]>;

  create(like: Like): Promise<Like>;

  delete(postId: string, userId: string): Promise<Like>;

  deleteAll(postId: string): Promise<void>;
}
