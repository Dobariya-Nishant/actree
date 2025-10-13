import { Follow } from "@/domain/entities/follow.entity";
import { FollowStatusTypeEnum, FollowTypeEnum } from "@/domain/enum/user.enum";

export interface IFollowService {
  update(
    followerId: string,
    followedId: string,
    status: FollowStatusTypeEnum
  ): Promise<Follow>;

  get(
    type: FollowTypeEnum,
    userId: string,
    createdAt?: Date
  ): Promise<{
    [FollowTypeEnum.FOLLOWERS]?: Follow[];
    [FollowTypeEnum.FOLLOWINGS]?: Follow[];
    [FollowTypeEnum.REQUESTED]?: Follow[];
    createdAt?: string;
  }>;

  getOne(
    followerId: string,
    followedId: string,
    status: FollowStatusTypeEnum
  ): Promise<Follow | null>;

  followOrRequest(
    followerId: string,
    followedId: string
  ): Promise<{ message: string; data: Follow }>;

  accept(followId: string): Promise<Follow>;

  getFollowingsIds(userId: string, createdAt?: Date): Promise<string[]>;

  delete(followerId: string, followedId: string): Promise<Follow>;

  deleteAll(followerId: string): Promise<void>;
}
