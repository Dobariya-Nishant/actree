import { inject, injectable } from "tsyringe";
import { NotFoundError } from "@/domain/errors/app-errors";
import { IWishListService } from "@/domain/interface/service/wishlist.service.interface";
import { IWishlistRepository } from "@/domain/interface/repositories/wishlist.repository.interface";
import { WishList } from "@/domain/entities/wishlist.entity";

@injectable()
export class WishListService implements IWishListService {
  constructor(
    @inject("WishListRepository")
    private wishlistRepository: IWishlistRepository
  ) {}

  async get({
    userId,
    limit,
    createdAt,
  }: {
    userId: string;
    limit?: number;
    createdAt?: Date;
  }): Promise<WishList[]> {
    const wishList = await this.wishlistRepository.get({
      userId,
      limit,
      createdAt,
    });

    if (!wishList?.length) {
      throw new NotFoundError("WishList not found");
    }

    return wishList;
  }

  create(wishlist: WishList): Promise<WishList> {
    return this.wishlistRepository.create(wishlist);
  }

  delete(userId: string, productId: string): Promise<void> {
    return this.wishlistRepository.delete(userId, productId);
  }
}
