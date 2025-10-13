import { injectable } from "tsyringe";
import { Comment } from "@/domain/entities/comment.entity";
import { ICommentRepository } from "@/domain/interface/repositories/comment.repository.interface";
import { getObjectId } from "@/domain/helpers/util";
import { NotFoundError } from "@/domain/errors/app-errors";
import { commentError } from "@/domain/messages/error/comment.error";
import { CommentModel } from "@/infrastructure/database/models/comment.model";

@injectable()
export class CommentRepository implements ICommentRepository {
  async get({
    postId,
    userId,
    createdAt,
    limit,
  }: {
    postId?: string;
    userId?: string;
    createdAt?: Date;
    limit: number;
  }): Promise<Comment[]> {
    const filter: Record<string, any> = {};

    if (postId) {
      filter.postId = getObjectId(postId);
    }

    if (userId) {
      filter.userId = getObjectId(userId);
    }

    filter.createdAt = { $lt: createdAt || new Date() };

    const comments = await CommentModel.find(filter)
      .populate("user")
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    if (!comments.length) {
      throw new NotFoundError(commentError.COMMENTS_NOT_FOUND);
    }

    return comments;
  }

  async getOne(commentId: string): Promise<Comment> {
    const comment = await CommentModel.findOne({ _id: commentId }).lean();

    if (!comment) {
      throw new NotFoundError(commentError.NOT_FOUND);
    }

    return comment;
  }

  create(comment: Comment): Promise<Comment> {
    return CommentModel.create(comment);
  }

  async update(commentId: string, comment: Partial<Comment>): Promise<Comment> {
    const commentIdObjectId = getObjectId(commentId);

    const updatedComment = await CommentModel.findOneAndUpdate(
      { _id: commentIdObjectId },
      comment,
      { new: true }
    )
      .populate("user")
      .lean();

    if (!updatedComment) {
      throw new NotFoundError(commentError.NOT_FOUND);
    }

    return updatedComment;
  }

  async delete(commentId: string): Promise<Comment> {
    const commentIdObjectId = getObjectId(commentId);

    const comment = await CommentModel.findOneAndDelete({
      _id: commentIdObjectId,
    });

    if (!comment) {
      throw new NotFoundError(commentError.NOT_FOUND);
    }

    return comment;
  }

  async deleteAll({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<void> {
    const filter: Record<string, any> = {};

    if (postId) {
      filter.postId = getObjectId(postId);
    }

    if (userId) {
      filter.userId = getObjectId(userId);
    }

    const comments = await CommentModel.deleteMany(filter);

    if (comments.deletedCount === 0) {
      throw new NotFoundError(commentError.COMMENTS_NOT_FOUND);
    }
  }
}
