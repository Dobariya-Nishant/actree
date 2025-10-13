import { inject, injectable } from "tsyringe";
import { Media } from "@/domain/entities/media.entity";
import { Comment } from "@/domain/entities/comment.entity";
import { ICommentService } from "@/domain/interface/service/comment.service.interface";
import { ICommentRepository } from "@/domain/interface/repositories/comment.repository.interface";
import { IStorageRepository } from "@/domain/interface/repositories/storage.repository.interface";
import { InternalServerError } from "@/domain/errors/app-errors";
import { IPostService } from "@/domain/interface/service/post.service.interface";
import { IPopulateService } from "@/domain/interface/service/populate.service.interface";
import { generateObjectId } from "@/domain/helpers/util";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject("CommentRepository") private commentRepository: ICommentRepository,
    @inject("StorageRepository") private storageRepository: IStorageRepository,
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
  }): Promise<Comment[]> {
    return this.commentRepository.get({
      postId,
      userId,
      createdAt,
      limit,
    });
  }

  async create(comment: Comment): Promise<Comment> {
    if (comment.media) {
      const mediaArray: Array<Media> = [];

      const filesUrls = await this.storageRepository.uploadFiles(
        comment.userId,
        comment.media
      );

      for (const fileObj of filesUrls) {
        const media: Media = {
          //@ts-ignore
          _id: generateObjectId(),
          url: fileObj.url,
          postId: comment.postId,
          userId: comment.userId,
          type: fileObj.type,
        };

        mediaArray.push(media);
      }

      comment.media = mediaArray;
    }

    const newComment = await this.commentRepository.create(comment);

    if (!newComment) throw new InternalServerError("Somthing Went Wrong!!");

    await this.postService.increaseCommentCount(newComment.postId);

    return newComment;
  }

  async update(
    commentId: string,
    commentUpdate: Partial<Comment>
  ): Promise<Comment> {
    if (commentUpdate.media) {
      const oldComment = await this.commentRepository.getOne(commentId);

      if (oldComment.media) {
        const fileUrls = oldComment.media.map((obj) => obj.url);
        await this.storageRepository.deleteFiles(fileUrls);
      }

      const mediaArray: Array<Media> = [];

      const filesUrls = await this.storageRepository.uploadFiles(
        oldComment.userId,
        commentUpdate.media
      );

      for (const fileObj of filesUrls) {
        const media: Media = {
          //@ts-ignore
          _id: generateObjectId(),
          url: fileObj.url,
          postId: oldComment._id,
          userId: oldComment.userId,
          type: fileObj.type,
        };
        mediaArray.push(media);
      }

      commentUpdate.media = mediaArray;
    }

    commentUpdate.isEdited = true;

    return this.commentRepository.update(commentId, commentUpdate);
  }

  async delete(commentId: string): Promise<Comment> {
    const deletedComment = await this.commentRepository.delete(commentId);

    if (!deletedComment) throw new InternalServerError("Somthing Went Wrong!!");

    await this.postService.decreaseCommentCount(deletedComment.postId);

    return deletedComment;
  }

  deleteAll({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<void> {
    return this.commentRepository.deleteAll({ userId, postId });
  }
}
