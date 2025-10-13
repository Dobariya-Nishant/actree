import { injectable } from "tsyringe";
import { getObjectId } from "@/domain/helpers/util";
import { ConflictError } from "@/domain/errors/app-errors";
import { Pin } from "@/domain/entities/pin.entity";
import { PinModel } from "@/infrastructure/database/models/pin.model";
import { IPinRepository } from "@/domain/interface/repositories/pin.repository.interface";

@injectable()
export class PinRepository implements IPinRepository {
  async get({
    queryUserId,
    userId,
  }: {
    queryUserId: string;
    userId: string;
  }): Promise<Pin | null> {
    const queryUserObjectId = getObjectId(queryUserId);

    return PinModel.findOne({ userId: queryUserObjectId })
      .populate({
        path: "pins",
        populate: [
          {
            path: "user",
          },
          {
            path: "isLiked",
            match: { userId: userId },
          },
          {
            path: "isBookMarked",
            match: { userId: userId },
          },
        ],
      })
      .lean();
  }

  async getOne(userId: string): Promise<Pin | null> {
    const userObjectId = getObjectId(userId);

    return PinModel.findOne({ userId: userObjectId }).lean();
  }

  async create({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<Pin | null> {
    const pin = await this.getOne(userId);

    if (pin && pin?.pins?.length >= 3) {
      throw new ConflictError("Pin limit reached");
    }

    return PinModel.findOneAndUpdate(
      { userId },
      { $push: { pins: postId } },
      { upsert: true, new: true }
    ).populate({ path: "pins" });
  }

  async remove({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<Pin | null> {
    return PinModel.findOneAndUpdate(
      { userId },
      { $pull: { pins: postId } },
      { new: true }
    ).populate({ path: "pins" });
  }
}
