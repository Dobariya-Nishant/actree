import { inject, injectable } from "tsyringe";
import { IFollowRepository } from "@/domain/interface/repositories/follow.repository.interface";
import { Follow } from "@/domain/entities/follow.entity";
import { IFollowService } from "@/domain/interface/service/follow.service.interface";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { followError } from "@/domain/messages/error/follow.error";
import { followRequestSuccess } from "@/domain/messages/success/follow-request.message";
import { followSuccess } from "@/domain/messages/success/follow.message";
import { FollowStatusTypeEnum, FollowTypeEnum } from "@/domain/enum/user.enum";

@injectable()
export class FollowService implements IFollowService {
  constructor(
    @inject("FollowRepository")
    private followRepository: IFollowRepository,
    @inject("UserService")
    private userServcie: IUserService
  ) {}

  async update(
    followerId: string,
    followedId: string,
    status: FollowStatusTypeEnum
  ): Promise<Follow> {
    try {
      const follow: Follow = { followerId, followedId, status };

      const newFollow = await this.followRepository.update(follow);

      if (!newFollow) throw new InternalServerError("Somthing went wrong");

      await Promise.all([
        this.userServcie.incrementFollowingCount(newFollow.followerId),
        this.userServcie.incrementFollowerCount(newFollow.followedId),
      ]);

      return newFollow;
    } catch (error) {
      //@ts-ignore
      if (error?.code === 11000) {
        throw new ConflictError(followError.ALREADY_EXIST);
      }
      throw error;
    }
  }

  getOne(
    followerId: string,
    followedId: string,
    status: FollowStatusTypeEnum
  ): Promise<Follow | null> {
    return this.followRepository.getOne(followerId, followedId, status);
  }

  getOneById(followId: string): Promise<Follow | null> {
    return this.followRepository.getOneById(followId);
  }

  async accept(followId: string): Promise<Follow> {
    const followRequest = await this.getOneById(followId);

    if (!followRequest) {
      throw new ConflictError(followError.REQUEST_NOT_FOUND);
    }

    const follow = await this.update(
      followRequest.followerId,
      followRequest.followedId,
      FollowStatusTypeEnum.FOLLOWING
    );

    return follow;
  }

  async followOrRequest(
    followerId: string,
    followedId: string
  ): Promise<{ message: string; data: Follow }> {
    const isFollowed = await this.getOne(
      followerId,
      followedId,
      FollowStatusTypeEnum.FOLLOWING
    );

    if (isFollowed) {
      throw new ConflictError(followError.ALREADY_EXIST);
    }

    const user = await this.userServcie.getOne({ userId: followedId });

    if (user.isPrivate) {
      const followRequest = await this.update(
        followerId,
        followedId,
        FollowStatusTypeEnum.REQUESTED
      );

      return {
        message: followRequestSuccess.SENT_FOLLOW_REQUEST,
        data: followRequest,
      };
    }

    const follow = await this.update(
      followerId,
      followedId,
      FollowStatusTypeEnum.FOLLOWING
    );

    return { message: followSuccess.FOLLOWED, data: follow };
  }

  async delete(followerId: string, followedId: string): Promise<Follow> {
    const deletedFollow = await this.followRepository.delete(
      followerId,
      followedId
    );

    if (!deletedFollow) {
      throw new NotFoundError(followError.NOT_FOLLOWED);
    }

    await Promise.all([
      this.userServcie.decrementFollowingCount(deletedFollow.followerId),
      this.userServcie.decrementFollowerCount(deletedFollow.followedId),
    ]);

    return deletedFollow;
  }

  getFollowingsIds(userId: string, createdAt?: Date): Promise<string[]> {
    return this.followRepository.getFollowingsIds(userId, 0, createdAt);
  }

  async get(
    type: FollowTypeEnum,
    userId: string,
    createdAt?: Date
  ): Promise<{
    [FollowTypeEnum.FOLLOWERS]?: Follow[];
    [FollowTypeEnum.FOLLOWINGS]?: Follow[];
    [FollowTypeEnum.REQUESTED]?: Follow[];
    createdAt?: string;
  }> {
    let follows;
    switch (type) {
      case FollowTypeEnum.FOLLOWERS:
        follows = await this.followRepository.getFollowers(
          userId,
          10,
          createdAt
        );
        break;
      case FollowTypeEnum.FOLLOWINGS:
        follows = await this.followRepository.getFollowings(
          userId,
          10,
          createdAt
        );
        break;
      case FollowTypeEnum.REQUESTED:
        follows = await this.followRepository.getFollowRequests(
          userId,
          10,
          createdAt
        );
        break;
      default:
        throw new UnprocessableEntityError(
          `${type} query perameter is not supported`
        );
    }

    if (!follows.length) {
      throw new NotFoundError(followError.FOLLOWERS_NOT_FOUND);
    }

    const createdAtDate = follows[follows.length - 1].createdAt;

    return { [type]: follows, createdAt: createdAtDate };
  }

  deleteAll(followerId: string): Promise<void> {
    return this.followRepository.deleteAll(followerId);
  }
}
