import { Post } from "@/domain/entities/post.entity";

export interface IPostRepository {
  get({
    isDeleted,
    limit,
    createdAt,
    userId,
    queryUserId,
    excludePostIds,
  }: {
    isDeleted?: boolean;
    limit: number;
    createdAt?: Date;
    userId?: string;
    queryUserId?: string;
    excludePostIds?: string[];
  }): Promise<Post[]>;

  getOne(postId: string): Promise<Post | null>;

  isExist({
    postId,
    userId,
  }: {
    postId?: string;
    userId?: string;
  }): Promise<Post | null>;

  create(post: Post): Promise<Post>;

  update(postId: string, postUpdate: Partial<Post>): Promise<Post | null>;

  updateCommentCount(postId: string, count: number): Promise<void>;

  updateRePostCount(postId: string, count: number): Promise<void>;

  updateLikeCount(postId: string, count: number): Promise<void>;

  delete(postId: string): Promise<Post>;
}
