import { injectable } from "tsyringe";
import { Post } from "@/domain/entities/post.entity";
import { IPostRepository } from "@/domain/interface/repositories/post.repository.interface";
import { getObjectId, getObjectIds } from "@/domain/helpers/util";
import { NotFoundError } from "@/domain/errors/app-errors";
import { postError } from "@/domain/messages/error/post.error";
import { PostModel } from "@/infrastructure/database/models/post.model";
import { userProjectionString } from "./projections/user.projection";

@injectable()
export class PostRepository implements IPostRepository {
  get({
    isDeleted,
    limit,
    createdAt,
    userId,
    queryUserId,
    excludePostIds,
  }: {
    isDeleted: boolean;
    limit: number;
    createdAt?: Date;
    userId?: string;
    queryUserId?: string;
    excludePostIds?: string[];
  }): Promise<Post[]> {
    const query = {
      createdAt: { $lt: createdAt || new Date() },
      isDeleted: isDeleted || false,
    };

    if (userId) {
      if (queryUserId) {
        const queryObjectUserId = getObjectId(queryUserId);
        //@ts-ignore
        query["userId"] = queryObjectUserId;
      }

      if (excludePostIds?.length) {
        const postObjectIds = getObjectIds(excludePostIds);
        //@ts-ignore
        query["_id"] = { $nin: postObjectIds };
      }

      return PostModel.find(query)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: userProjectionString,
        })
        .populate("orignalPostId")
        .populate({
          path: "isLiked",
          match: { userId: userId },
        })
        .populate({
          path: "isBookMarked",
          match: { userId: userId },
        })
        .populate({
          path: "likes",
          populate: [
            {
              path: "user",
              select: userProjectionString,
            },
          ],
        })
        .lean();
    }

    return PostModel.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: userProjectionString,
      })
      .populate("orignalPostId")
      .populate({
        path: "likes",
      })
      .lean();
  }

  getOne(postId: string): Promise<Post | null> {
    const postObjectId = getObjectId(postId);

    return PostModel.findOne({
      _id: postObjectId,
      isDeleted: false,
    })
      .populate({
        path: "user",
        select: userProjectionString,
      })
      .populate("orignalPostId")
      .lean();
  }

  isExist({
    postId,
    userId,
  }: {
    postId?: string;
    userId?: string;
  }): Promise<Post | null> {
    return PostModel.findOne({
      ...(postId && { _id: getObjectId(postId) }),
      ...(userId && { userId: getObjectId(userId) }),
    }).lean();
  }

  create(post: Post): Promise<Post> {
    return PostModel.create(post);
  }

  update(postId: string, postUpdate: Partial<Post>): Promise<Post | null> {
    const postObjectId = getObjectId(postId);

    return PostModel.findOneAndUpdate({ _id: postObjectId }, postUpdate, {
      new: true,
    })
      .populate("user")
      .populate("orignalPostId")
      .lean();
  }

  async updateRePostCount(postId: string, count: number = 1): Promise<void> {
    const postObjectId = getObjectId(postId);

    const post = await PostModel.updateOne(
      { _id: postObjectId },
      { $inc: { repostCount: count } }
    );

    if (post.matchedCount === 0) {
      throw new NotFoundError(postError.NOT_FOUND);
    }
  }

  async updateCommentCount(postId: string, count: number = 1): Promise<void> {
    const postObjectId = getObjectId(postId);

    const post = await PostModel.updateOne(
      { _id: postObjectId },
      { $inc: { commentCount: count } }
    );

    if (post.matchedCount === 0) {
      throw new NotFoundError(postError.NOT_FOUND);
    }
  }

  async updateLikeCount(postId: string, count: number = 1): Promise<void> {
    const postObjectId = getObjectId(postId);

    const post = await PostModel.updateOne(
      { _id: postObjectId },
      { $inc: { likeCount: count } }
    );

    if (post.matchedCount === 0) {
      throw new NotFoundError(postError.NOT_FOUND);
    }
  }

  async delete(postId: string): Promise<Post> {
    const postObjectId = getObjectId(postId);

    const post = await PostModel.findOneAndUpdate(
      { _id: postObjectId },
      { isDeleted: true }
    );

    if (!post) {
      throw new NotFoundError(postError.NOT_FOUND);
    }

    return post;
  }
}
