import { Like } from "@/domain/entities/like.entity";

export interface ILikeService {
  get({
    postId,
    userId,
    createdAt,
    limit,
  }: {
    postId?: string;
    userId?: string;
    createdAt: Date;
    limit: number;
  }): Promise<Like[]>;

  create(comment: Like): Promise<Like>;

  delete(postId: string, userId: string): Promise<Like>;

  deleteAll(postId: string): Promise<void>;
}
