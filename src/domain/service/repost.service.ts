import { inject, injectable } from "tsyringe";
import { Post } from "@/domain/entities/post.entity";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { rePostError } from "@/domain/messages/error/repost.error";
import { IPostService } from "@/domain/interface/service/post.service.interface";

@injectable()
export class RePostService {
  constructor(@inject("PostService") private postService: IPostService) {}

  async create(rePost: Post): Promise<Post> {
    if (!rePost.orignalPostId) {
      throw new UnprocessableEntityError(rePostError.ORIGNAL_POST_ID);
    }

    const isPostExist = await this.postService.isExist({
      postId: rePost.orignalPostId,
      userId: rePost.userId,
    });

    if (isPostExist) {
      throw new ConflictError(rePostError.ALREADY_EXIST);
    }

    rePost.isRePost = true;

    const newRePost = await this.postService.create(rePost);

    if (!newRePost) {
      throw new InternalServerError(rePostError.INTERNAL_ERROR);
    }

    await this.postService.increaseRePostCount(rePost.orignalPostId, 1);

    return newRePost;
  }

  async update(postId: string, rePostUpdate: Partial<Post>): Promise<Post> {
    return this.postService.update(postId, rePostUpdate);
  }

  async get(createdAt?: Date): Promise<Post[]> {
    const posts = await this.postService.get({ createdAt });

    if (!posts.length) {
      throw new NotFoundError(rePostError.POSTS_NOT_FOUND);
    }

    return posts;
  }

  async getOne(postId: string): Promise<Post> {
    return this.postService.getOne(postId);
  }

  async delete(postId: string): Promise<Post> {
    const deletedPost = await this.postService.delete(postId);

    if (deletedPost.orignalPostId) {
      await this.postService.decreaseRePostCount(deletedPost.orignalPostId, -1);
    }

    return deletedPost;
  }
}
