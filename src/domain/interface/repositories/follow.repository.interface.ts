import { Follow } from "@/domain/entities/follow.entity";
import { FollowStatusTypeEnum } from "@/domain/enum/user.enum";

export interface IFollowRepository {
  getOne(
    followerId: string,
    followedId: string,
    status: FollowStatusTypeEnum
  ): Promise<Follow | null>;

  getFollowRequests(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<Follow[]>;

  getFollowers(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<Follow[]>;

  getFollowings(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<Follow[]>;

  getFollowingsIds(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<string[]>;

  getOneById(followId: string): Promise<Follow | null>;

  update(follow: Follow): Promise<Follow | null>;

  delete(followerId: string, followedId: string): Promise<Follow | null>;

  deleteAll(followerId: string): Promise<void>;
}
