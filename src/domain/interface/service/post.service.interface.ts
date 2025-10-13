import { Post } from "@/domain/entities/post.entity";

export interface IPostService {
  get({
    isDeleted,
    createdAt,
    token,
    userId,
    queryUserId,
  }: {
    isDeleted?: boolean;
    createdAt?: Date;
    token?: string;
    userId?: string;
    queryUserId?: string;
  }): Promise<Post[]>;

  getOne(postId: string): Promise<Post>;

  isExist({
    postId,
    userId,
  }: {
    postId?: string;
    userId?: string;
  }): Promise<Post | null>;

  create(post: Post): Promise<Post>;

  update(postId: string, post: Partial<Post>): Promise<Post>;

  increaseCommentCount(postId: string, count?: number): Promise<void>;

  decreaseCommentCount(postId: string, count?: number): Promise<void>;

  increaseLikeCount(postId: string, count?: number): Promise<void>;

  decreaseLikeCount(postId: string, count?: number): Promise<void>;

  increaseRePostCount(postId: string, count?: number): Promise<void>;

  decreaseRePostCount(postId: string, count?: number): Promise<void>;

  delete(postId: string): Promise<Post>;
}
