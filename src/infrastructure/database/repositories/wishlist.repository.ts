import { injectable } from "tsyringe";
import WishListModel from "@/infrastructure/database/models/wishlist.model";
import { WishList } from "@/domain/entities/wishlist.entity";
import { ConflictError } from "@/domain/errors/app-errors";
import { IWishlistRepository } from "@/domain/interface/repositories/wishlist.repository.interface";
import { userProjectionString } from "./projections/user.projection";

@injectable()
export class WishListRepository implements IWishlistRepository {
  get({
    userId,
    limit,
    createdAt,
  }: {
    userId: string;
    limit?: number;
    createdAt?: Date;
  }): Promise<WishList[]> {
    if (createdAt) {
      createdAt = new Date(createdAt);
    } else {
      createdAt = new Date();
    }

    return WishListModel.find({
      createdAt: { $lt: createdAt },
      userId: userId,
    })
      .populate({
        path: "product",
        populate: [
          { path: "seller", select: userProjectionString },
          {
            path: "isPurchased",
            match: { buyerId: userId },
          },
        ],
      })
      .limit(limit || 0)
      .sort({ createdAt: -1 });
  }

  async create(wishlist: WishList): Promise<WishList> {
    try {
      const wishList = await WishListModel.create(wishlist);
      return wishList;
    } catch (error) {
      //@ts-ignore
      if (error?.code === 11000) {
        throw new ConflictError("Product already exist in wishlist");
      }
      throw error;
    }
  }

  async delete(userId: string, productId: string): Promise<void> {
    await WishListModel.deleteOne({ productId: productId, userId: userId });
  }
}
