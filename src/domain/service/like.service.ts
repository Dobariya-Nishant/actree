import { inject, injectable } from "tsyringe";
import { Like } from "@/domain/entities/like.entity";
import { ILikeService } from "@/domain/interface/service/like.service.interface";
import { ILikeRepository } from "@/domain/interface/repositories/like.repository.interface";
import { InternalServerError } from "@/domain/errors/app-errors";
import { IPostService } from "@/domain/interface/service/post.service.interface";
import { IPopulateService } from "@/domain/interface/service/populate.service.interface";

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject("LikeRepository") private likeRepository: ILikeRepository,
    @inject("PostService") private postService: IPostService
  ) {}

  async get({
    postId,
    userId,
    createdAt,
    limit,
  }: {
    postId?: string;
    userId?: string;
    createdAt: Date;
    limit: number;
  }): Promise<Like[]> {
    return this.likeRepository.get({
      postId,
      userId,
      createdAt,
      limit,
    });
  }

  async create(like: Like): Promise<Like> {
    const newLike = await this.likeRepository.create(like);

    if (!newLike) throw new InternalServerError("Somthing Went Wrong!!");

    await this.postService.increaseLikeCount(newLike.postId);

    return newLike;
  }

  async delete(postId: string, userId: string): Promise<Like> {
    const deletedLike = await this.likeRepository.delete(postId, userId);

    if (!deletedLike) throw new InternalServerError("Somthing Went Wrong!!");

    await this.postService.decreaseLikeCount(deletedLike.postId);

    return deletedLike;
  }

  deleteAll(postId: string): Promise<void> {
    return this.likeRepository.deleteAll(postId);
  }
}
