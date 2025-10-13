import { WishList } from "@/domain/entities/wishlist.entity";

export interface IWishListService {
  get({
    userId,
    limit,
    createdAt,
  }: {
    userId: string;
    limit?: number;
    createdAt?: Date;
  }): Promise<WishList[]>;

  create(wishlist: WishList): Promise<WishList>;

  delete(userId: string, productId: string): Promise<void>;
}
