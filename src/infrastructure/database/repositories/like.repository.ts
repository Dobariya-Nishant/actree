import { injectable } from "tsyringe";
import { Like } from "@/domain/entities/like.entity";
import { ILikeRepository } from "@/domain/interface/repositories/like.repository.interface";
import { getObjectId } from "@/domain/helpers/util";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { likeError } from "@/domain/messages/error/like.error";
import { LikeModel } from "@/infrastructure/database/models/like.model";

@injectable()
export class LikeRepository implements ILikeRepository {
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
  }): Promise<Like[]> {
    const filter: Record<string, any> = {};

    if (postId) {
      filter.postId = getObjectId(postId);
    }

    if (userId) {
      filter.userId = getObjectId(userId);
    }

    filter.createdAt = { $lt: createdAt || new Date() };

    const likes = await LikeModel.find(filter)
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (!likes.length) {
      throw new NotFoundError(likeError.LIKES_NOT_FOUND);
    }

    return likes;
  }

  async create(like: Like): Promise<Like> {
    try {
      const newLike = await LikeModel.create(like);
      return newLike;
    } catch (error) {
      //@ts-ignore
      if (error?.code === 11000) {
        throw new UnprocessableEntityError(`Like already exist!!`);
      }

      throw error;
    }
  }

  async delete(postId: string, userId: string): Promise<Like> {
    const like = await LikeModel.findOneAndDelete({ postId, userId }).lean();

    if (!like) {
      throw new NotFoundError(likeError.LIKES_NOT_FOUND);
    }

    return like;
  }

  async deleteAll(postId: string): Promise<void> {
    await LikeModel.deleteMany({ postId }).lean();
  }
}
