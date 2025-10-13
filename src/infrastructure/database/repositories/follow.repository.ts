import { injectable } from "tsyringe";
import { Follow } from "@/domain/entities/follow.entity";
import { FollowModel } from "@/infrastructure/database/models/follow.model";
import { IFollowRepository } from "@/domain/interface/repositories/follow.repository.interface";
import { FollowStatusTypeEnum } from "@/domain/enum/user.enum";
import { getObjectId } from "@/domain/helpers/util";

@injectable()
export class FollowRepository implements IFollowRepository {
  getFollowRequests(
    userId: string,
    limit: number = 10,
    createdAt?: Date
  ): Promise<Follow[]> {
    return FollowModel.find({
      followedId: userId,
      status: FollowStatusTypeEnum.REQUESTED,
      ...(createdAt && { createdAt: { $lt: createdAt } }),
    })
      .limit(limit)
      .populate({ path: "followerId", select: "-password  -sessions" });
  }

  getFollowers(
    userId: string,
    limit: number = 10,
    createdAt?: Date
  ): Promise<Follow[]> {
    return FollowModel.find({
      followedId: userId,
      status: FollowStatusTypeEnum.FOLLOWING,
      ...(createdAt && { createdAt: { $lt: createdAt } }),
    })
      .limit(limit)
      .populate({ path: "followedUser", select: "-password  -sessions" });
  }

  async getFollowings(
    userId: string,
    limit: number = 10,
    createdAt?: Date
  ): Promise<Follow[]> {
    return FollowModel.find({
      followerId: userId,
      status: FollowStatusTypeEnum.FOLLOWING,
      ...(createdAt && { createdAt: { $lt: createdAt } }),
    })
      .limit(limit)
      .populate({ path: "followedUser", select: "-password  -sessions" });
  }

  getOneById(followId: string): Promise<Follow | null> {
    const followObjetId = getObjectId(followId);
    return FollowModel.findById(followObjetId);
  }

  getOne(followerId: string, followedId: string): Promise<Follow | null> {
    return FollowModel.findOne({
      followerId,
      followedId,
      status: FollowStatusTypeEnum.FOLLOWING,
    });
  }

  async getFollowingsIds(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<string[]> {
    const followings = await FollowModel.find(
      {
        followerId: userId,
        status: FollowStatusTypeEnum.FOLLOWING,
        ...(createdAt && { createdAt: { $lt: createdAt } }),
      },
      { followedId: 1, _id: 0 }
    )
      .limit(limit)
      .lean();

    const followingIds = followings.map((obj) => obj.followedId);

    return followingIds;
  }

  update(follow: Follow): Promise<Follow | null> {
    return FollowModel.findOneAndUpdate(
      { followedId: follow.followedId, followerId: follow.followerId },
      follow,
      { upsert: true, new: true }
    );
  }

  async delete(followerId: string, followedId: string): Promise<Follow | null> {
    return FollowModel.findOneAndDelete({
      followerId,
      followedId,
    });
  }

  async deleteAll(followerId: string): Promise<void> {
    await FollowModel.deleteMany({ followerId });
  }
}
