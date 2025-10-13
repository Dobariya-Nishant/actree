import { inject, injectable } from "tsyringe";
import {
  CategoryTypeEnum,
  ProductStatusEnum,
} from "@/domain/enum/product.enum";
import { IProductService } from "@/domain/interface/service/product.service.interface";
import { IProductRepository } from "@/domain/interface/repositories/product.repository.interface";
import { IStorageRepository } from "@/domain/interface/repositories/storage.repository.interface";
import { Product } from "@/domain/entities/product.entity";
import { Media } from "@/domain/entities/media.entity";
import { generateObjectId } from "@/domain/helpers/util";
import { InternalServerError, NotFoundError } from "@/domain/errors/app-errors";
import { NotificationService } from "./notification.service";
import { NotificationTypeEnum } from "../enum/notification.enum";

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject("ProductRepository")
    private productRepository: IProductRepository,
    @inject("NotificationService")
    private notificationService: NotificationService,
    @inject("StorageRepository")
    private storageRepository: IStorageRepository
  ) {}

  async create(product: Product): Promise<Product> {
    if (!Array.isArray(product.displayMedia)) {
      product.displayMedia = [product.displayMedia];
    }

    if (!Array.isArray(product.orignalMedia)) {
      product.orignalMedia = [product.orignalMedia];
    }

    if (product?.profilePicture) {
      const profilePictureInfo = await this.storageRepository.uploadFiles(
        product.userId,
        [product.profilePicture]
      );

      const media: Media = {
        //@ts-ignore
        _id: generateObjectId(),
        userId: product.userId,
        productId: product._id,
        type: profilePictureInfo[0].type,
        url: profilePictureInfo[0].url,
      };

      product.profilePicture = media;
    }

    const displayMediaFileInfo = await this.storageRepository.uploadFiles(
      product.userId,
      product.displayMedia
    );

    const orignalMediaFileInfo = await this.storageRepository.uploadFiles(
      product.userId,
      product.orignalMedia
    );

    const displayMedia: Array<Media> = [];
    const orignalMedia: Array<Media> = [];

    for (const info of displayMediaFileInfo) {
      const media: Media = {
        //@ts-ignore
        _id: generateObjectId(),
        userId: product.userId,
        productId: product._id,
        type: info.type,
        url: info.url,
      };

      displayMedia.push(media);
    }

    for (const info of orignalMediaFileInfo) {
      const media: Media = {
        //@ts-ignore
        _id: generateObjectId(),
        userId: product.userId,
        productId: product._id,
        type: info.type,
        url: info.url,
      };

      orignalMedia.push(media);
    }

    product.displayMedia = displayMedia;
    product.orignalMedia = orignalMedia;

    const newProduct = await this.productRepository.create(product);

    await this.notificationService.create(
      newProduct.userId,
      `product ${product.name} is created successfully currently under verification`,
      NotificationTypeEnum.PRODUCT_CREATE
    );

    return newProduct;
  }

  async update(
    productId: string,
    productUpdate: Partial<Product>
  ): Promise<Product> {
    const oldProduct = await this.getById(productId);

    if (!oldProduct) {
      throw new NotFoundError("product not found!");
    }

    if (productUpdate?.profilePicture) {
      if (oldProduct.profilePicture) {
        await this.storageRepository.deleteFiles([
          oldProduct.profilePicture.url,
        ]);
      }

      const profilePictureInfo = await this.storageRepository.uploadFiles(
        oldProduct.userId,
        [productUpdate.profilePicture]
      );

      const media: Media = {
        //@ts-ignore
        _id: generateObjectId(),
        userId: oldProduct.userId,
        productId: oldProduct._id,
        type: profilePictureInfo[0].type,
        url: profilePictureInfo[0].url,
      };

      productUpdate.profilePicture = media;
    }

    if (productUpdate?.displayMedia) {
      if (oldProduct.displayMedia) {
        const fileUrls = oldProduct.displayMedia.map((obj) => obj.url);
        await this.storageRepository.deleteFiles(fileUrls);
      }

      if (!Array.isArray(productUpdate.displayMedia)) {
        productUpdate.displayMedia = [productUpdate.displayMedia];
      }

      const displayMediaFileInfo = await this.storageRepository.uploadFiles(
        oldProduct.userId,
        productUpdate.displayMedia
      );

      const displayMedia: Array<Media> = [];

      for (const info of displayMediaFileInfo) {
        const media: Media = {
          //@ts-ignore
          _id: generateObjectId(),
          userId: oldProduct.userId,
          productId: oldProduct._id,
          type: info.type,
          url: info.url,
        };

        displayMedia.push(media);
      }

      productUpdate.displayMedia = displayMedia;
    }

    if (productUpdate?.orignalMedia) {
      if (oldProduct.orignalMedia) {
        const fileUrls = oldProduct.orignalMedia.map((obj) => obj.url);
        await this.storageRepository.deleteFiles(fileUrls);
      }

      if (!Array.isArray(productUpdate.orignalMedia)) {
        productUpdate.orignalMedia = [productUpdate.orignalMedia];
      }

      const orignalMediaFileInfo = await this.storageRepository.uploadFiles(
        oldProduct.userId,
        productUpdate.orignalMedia
      );

      const orignalMedia: Array<Media> = [];

      for (const info of orignalMediaFileInfo) {
        const media: Media = {
          //@ts-ignore
          _id: generateObjectId(),
          userId: oldProduct.userId,
          productId: oldProduct._id,
          type: info.type,
          url: info.url,
        };

        orignalMedia.push(media);
      }

      productUpdate.orignalMedia = orignalMedia;
    }

    const product = await this.productRepository.update(
      productId,
      productUpdate
    );

    if (!product) {
      throw new NotFoundError("productUpdate not found!");
    }

    if (productUpdate.status === ProductStatusEnum.APPROVED) {
      await this.notificationService.create(
        product.userId,
        `product ${product.name} is approved by activatree`,
        NotificationTypeEnum.PRODUCT_APPROVED
      );
    } else {
      await this.notificationService.create(
        product.userId,
        `product ${product.name} is updated successfully`,
        NotificationTypeEnum.PRODUCT_UPDATE
      );
    }

    return product;
  }

  async delete(productId: string): Promise<void> {
    const product = await this.productRepository.delete(productId);

    if (!product) {
      throw new InternalServerError(
        "something went wrong while deleting product"
      );
    }

    await this.notificationService.create(
      product.userId,
      `product ${product.name} is deleted successfully`,
      NotificationTypeEnum.PRODUCT_UPDATE
    );
  }

  async getById(productId: string, userId?: string): Promise<Product> {
    const product = await this.productRepository.getOne(productId, userId);

    if (!product) {
      throw new NotFoundError("product not found");
    }

    return product;
  }

  async get({
    status,
    isCustomCategory,
    isDeleted,
    queryUserId,
    limit,
    search,
    price,
    category,
    createdAt,
    userId,
  }: {
    isCustomCategory?: boolean;
    status: ProductStatusEnum;
    queryUserId?: string;
    isDeleted?: boolean;
    search?: string;
    category: CategoryTypeEnum;
    price?: number;
    limit?: number;
    userId?: string;
    createdAt?: Date;
  }): Promise<{ products: Product[]; createdAt: Date | null | undefined }> {
    const products = await this.productRepository.get({
      isCustomCategory,
      isDeleted,
      status,
      queryUserId,
      limit,
      price,
      search,
      category,
      userId,
      createdAt,
    });

    const lastCreatedAt =
      products.length > 0 ? products[products.length - 1].createdAt : null;

    return { products, createdAt: lastCreatedAt };
  }
}
