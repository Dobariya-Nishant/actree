import { injectable } from "tsyringe";
import ProductModel from "@/infrastructure/database/models/product.model";
import { Product } from "@/domain/entities/product.entity";
import {
  CategoryTypeEnum,
  ProductStatusEnum,
} from "@/domain/enum/product.enum";
import { getObjectId } from "@/domain/helpers/util";
import { IProductRepository } from "@/domain/interface/repositories/product.repository.interface";
import { userProjectionString } from "@/infrastructure/database/repositories/projections/user.projection";

@injectable()
export class ProductRepository implements IProductRepository {
  getOne(productId: string, userId?: string): Promise<Product | null> {
    const productObjectId = getObjectId(productId);

    if (!userId) {
      return ProductModel.findOne({
        _id: productObjectId,

        isCustomCategory: false,
        isDeleted: false,
      })
        .populate({
          path: "seller",
          select: userProjectionString,
        })
        .lean();
    }

    return ProductModel.findOne({
      _id: productId,
      isCustomCategory: false,
      isDeleted: false,
    })
      .populate({
        path: "seller",
        select: userProjectionString,
      })
      .populate({
        path: "isPurchased",
        match: { buyerId: userId },
      })
      .populate({ path: "isWishlist", match: { userId: userId } })
      .lean();
  }

  get({
    status = ProductStatusEnum.APPROVED,
    isCustomCategory = false,
    isDeleted = false,
    queryUserId,
    limit,
    search,
    price,
    category,
    createdAt,
    userId,
  }: {
    status: ProductStatusEnum;
    isCustomCategory?: boolean;
    queryUserId?: string;
    isDeleted?: boolean;
    search?: string;
    category: CategoryTypeEnum;
    price?: number;
    limit?: number;
    userId?: string;
    createdAt?: Date;
  }): Promise<Product[]> {
    if (createdAt) {
      createdAt = new Date(createdAt);
    } else {
      createdAt = new Date();
    }

    if (userId) {
      return ProductModel.find({
        createdAt: { $lt: createdAt },
        isDeleted: isDeleted,
        isCustomCategory: isCustomCategory,
        status: status,
        ...(search && { name: { $regex: search, $options: "i" } }),
        ...(price && { price: { $lte: price } }),
        ...(category && { category: category }),
        ...(queryUserId && { userId: queryUserId }),
      })
        .populate({
          path: "seller",
          select: userProjectionString,
        })
        .populate({ path: "isWishlist", match: { userId: userId } })
        .populate({
          path: "isPurchased",
          match: { buyerId: userId },
        })
        .limit(limit || 0)
        .sort({ createdAt: -1 })
        .lean();
    }

    return ProductModel.find({
      createdAt: { $lt: createdAt },
      status: status,
      isDeleted: false,
      isCustomCategory: false,
      ...(category && { category: category }),
      ...(queryUserId && { userId: queryUserId }),
    })
      .populate({
        path: "seller",
        select: userProjectionString,
      })
      .limit(limit || 0)
      .sort({ createdAt: -1 })
      .lean();
  }

  getById(productId: string): Promise<Product | null> {
    return ProductModel.findById(productId)
      .populate({
        path: "seller",
        select: userProjectionString,
      })
      .lean();
  }

  create(user: Product): Promise<Product> {
    return ProductModel.create(user);
  }

  update(
    productId: string,
    productUpdate: Partial<Product>
  ): Promise<Product | null> {
    return ProductModel.findOneAndUpdate({ _id: productId }, productUpdate, {
      new: true,
    })
      .populate({
        path: "seller",
        select: userProjectionString,
      })
      .lean();
  }

  async delete(productId: string): Promise<Product | null> {
    return ProductModel.findOneAndUpdate(
      { _id: productId },
      { isDeleted: true }
    );
  }
}
