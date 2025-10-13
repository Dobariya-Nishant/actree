import { Comment } from "@/domain/entities/comment.entity";

export interface ICommentService {
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
  }): Promise<Comment[]>;

  create(comment: Comment): Promise<Comment>;

  update(commentId: string, comment: Partial<Comment>): Promise<Comment>;

  delete(commentId: string): Promise<Comment>;

  deleteAll({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<void>;
}
