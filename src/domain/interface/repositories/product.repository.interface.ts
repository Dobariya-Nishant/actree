import { Product } from "@/domain/entities/product.entity";
import {
  CategoryTypeEnum,
  ProductStatusEnum,
} from "@/domain/enum/product.enum";

export interface IProductRepository {
  get({
    isCustomCategory,
    status,
    isDeleted,
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
  }): Promise<Product[]>;

  getOne(productId: string, userId?: string): Promise<Product | null>;

  create(user: Product): Promise<Product>;

  update(
    productId: string,
    productUpdate: Partial<Product>
  ): Promise<Product | null>;

  delete(productId: string): Promise<Product | null>;
}
