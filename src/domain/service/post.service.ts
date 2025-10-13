import { inject, injectable } from "tsyringe";
import { Post } from "@/domain/entities/post.entity";
import { Media } from "@/domain/entities/media.entity";
import { IPostService } from "@/domain/interface/service/post.service.interface";
import { IPostRepository } from "@/domain/interface/repositories/post.repository.interface";
import { IStorageRepository } from "@/domain/interface/repositories/storage.repository.interface";
import { generateObjectId } from "@/domain/helpers/util";
import { ConflictError, NotFoundError } from "@/domain/errors/app-errors";
import { postError } from "@/domain/messages/error/post.error";
import { IPinService } from "@/domain/interface/service/pin.service.interface";

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject("PostRepository") private postRepository: IPostRepository,
    @inject("StorageRepository") private storageRepository: IStorageRepository,
    @inject("PinService") private pinService: IPinService
  ) {}

  async create(post: Post): Promise<Post> {
    if (post?.orignalPostId) {
      const isPostExist = await this.isExist({
        postId: post.orignalPostId,
        userId: post.userId,
      });

      if (isPostExist) {
        throw new ConflictError(postError.ALREADY_EXIST);
      }

      post.isRePost = true;
    }

    if (post?.media) {
      const mediaArray: Array<Media> = [];

      if (!Array.isArray(post.media)) {
        post.media = [post.media];
      }

      const filesUrls = await this.storageRepository.uploadFiles(
        post.userId,
        post.media
      );

      for (const fileObj of filesUrls) {
        const media: Media = {
          //@ts-ignore
          _id: generateObjectId(),
          url: fileObj.url,
          postId: post._id,
          userId: post.userId,
          type: fileObj.type,
        };

        mediaArray.push(media);
      }

      post.media = mediaArray;
    }

    const newPost = await this.postRepository.create(post);

    if (post.orignalPostId) {
      await this.increaseRePostCount(post.orignalPostId, 1);
    }

    return newPost;
  }

  async update(postId: string, postUpdate: Partial<Post>): Promise<Post> {
    if (postUpdate.media) {
      const oldPost = await this.postRepository.getOne(postId);

      if (!oldPost) {
        throw new NotFoundError(postError.NOT_FOUND);
      }

      if (oldPost.media) {
        const fileUrls = oldPost.media.map((obj) => obj.url);
        await this.storageRepository.deleteFiles(fileUrls);
      }

      const mediaArray: Array<Media> = [];

      const filesUrls = await this.storageRepository.uploadFiles(
        oldPost.userId,
        postUpdate.media
      );

      for (const fileObj of filesUrls) {
        const media: Media = {
          //@ts-ignore
          _id: generateObjectId(),
          url: fileObj.url,
          postId: oldPost._id,
          userId: oldPost.userId,
          type: fileObj.type,
        };
        mediaArray.push(media);
      }
      postUpdate.media = mediaArray;
    }

    postUpdate.isEdited = true;

    const updatedPost = await this.postRepository.update(postId, postUpdate);

    if (!updatedPost) {
      throw new NotFoundError(postError.NOT_FOUND);
    }

    return updatedPost;
  }

  async get({
    isDeleted,
    createdAt,
    userId,
    queryUserId,
    excludePostIds,
  }: {
    isDeleted?: boolean;
    createdAt?: Date;
    userId?: string;
    queryUserId?: string;
    excludePostIds?: string[];
  }): Promise<Post[]> {
    const postList: Post[] = [];
    if (!createdAt && queryUserId && userId) {
      const pin = await this.pinService.get({ queryUserId, userId });

      for (const pinObj of pin?.pins) {
        //@ts-ignore
        pinObj.isPinned = true;
      }
      //@ts-ignore
      postList.push(...pin?.pins);
    }

    const posts = await this.postRepository.get({
      isDeleted,
      limit: 10 - postList.length,
      createdAt,
      userId,
      queryUserId,
      excludePostIds,
    });

    postList.push(...posts);

    if (!posts.length) {
      throw new NotFoundError(postError.POSTS_NOT_FOUND);
    }

    return postList;
  }

  async getOne(postId: string): Promise<Post> {
    const post = await this.postRepository.getOne(postId);

    if (!post) {
      throw new NotFoundError(postError.NOT_FOUND);
    }

    return post;
  }

  isExist(query: { postId?: string; userId?: string }): Promise<Post | null> {
    return this.postRepository.isExist(query);
  }

  increaseCommentCount(postId: string, count?: number): Promise<void> {
    return this.postRepository.updateCommentCount(postId, count || 1);
  }

  decreaseCommentCount(postId: string, count?: number): Promise<void> {
    return this.postRepository.updateCommentCount(postId, count || -1);
  }

  increaseLikeCount(postId: string, count?: number): Promise<void> {
    return this.postRepository.updateLikeCount(postId, count || 1);
  }

  decreaseLikeCount(postId: string, count?: number): Promise<void> {
    return this.postRepository.updateLikeCount(postId, count || -1);
  }

  increaseRePostCount(postId: string, count?: number): Promise<void> {
    return this.postRepository.updateRePostCount(postId, count || 1);
  }

  decreaseRePostCount(postId: string, count?: number): Promise<void> {
    return this.postRepository.updateRePostCount(postId, count || -1);
  }

  async delete(postId: string): Promise<Post> {
    const deletedPost = await this.postRepository.delete(postId);

    if (deletedPost.orignalPostId) {
      await this.decreaseRePostCount(deletedPost.orignalPostId, -1);
    }

    return deletedPost;
  }
}
