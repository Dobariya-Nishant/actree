import { Product } from "@/domain/entities/product.entity";
import {
  CategoryTypeEnum,
  ProductStatusEnum,
} from "@/domain/enum/product.enum";

export interface IProductService {
  create(product: Product): Promise<Product>;

  update(productId: string, productUpdate: Partial<Product>): Promise<Product>;

  delete(productId: string): Promise<void>;

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
  }): Promise<{ products: Product[]; createdAt: Date | null | undefined }>;

  getById(productId: string, userId?: string): Promise<Product>;
}
