import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { IProductService } from "@/domain/interface/service/product.service.interface";
import { calculatePlatformFee, generateObjectId } from "@/domain/helpers/util";
import { Product } from "@/domain/entities/product.entity";
import { RoleTypeEnum } from "@/domain/enum/user.enum";
import {
  CategoryTypeEnum,
  ProductStatusEnum,
} from "@/domain/enum/product.enum";

@injectable()
export class ProductController {
  constructor(
    @inject("ProductService")
    private productService: IProductService
  ) {}

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;

    const { credentials: user } = request.auth as any;

    if (query.productId) {
      const product = await this.productService.getById(
        query.productId,
        user._id
      );

      return h
        .response({
          statusCode: 200,
          data: { product },
          message: "Product send successFully",
        })
        .code(200);
    }

    const products = await this.productService.get({
      ...(user?.scope?.includes(RoleTypeEnum.ADMIN) && {
        status: query.status || ProductStatusEnum.PENDING,
        isDeleted: query.isDeleted || false,
        isCustomCategory: query.isCustomCategory || false,
      }),
      ...(query.sellerId && { sellerId: query.sellerId }),
      ...(user._id && { userId: user._id }),
      ...(query.search && { search: query.search }),
      ...(query.createdAt && { createdAt: new Date(query.createdAt) }),
      ...(query.price && { price: query.price }),
      ...(query.category && { category: query.category }),
    });

    return h
      .response({
        statusCode: 200,
        data: products,
        message: "Products send successFully",
      })
      .code(200);
  }

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    if (!body.displayMedia || !body.orignalMedia) {
      throw new UnprocessableEntityError(
        "images and orignal content is required"
      );
    }

    const { sellerReceive, platformFee } = calculatePlatformFee(
      Number(body.price)
    );

    const product: Product = {
      //@ts-ignore
      _id: generateObjectId(),
      userId: user._id,
      isCustom: false,
      price: body.price,
      category: body.category,
      platformFee: String(platformFee),
      formate: body.formate,
      sellerReceive: String(sellerReceive),
      size: body.size,
      dimension: body.dimension,
      frameRate: body.frameRate,
      resolution: body.resolution,
      itemPartNumber: body.itemPartNumber,
      countryOfOrigin: body.countryOfOrigin,
      fontFor: body.fontFor,
      tags: body.tags,
      name: body.name,
      platform: body.platform,
      description: body.description,
      displayMedia: body.displayMedia,
      orignalMedia: body.orignalMedia,
      profilePicture: body.profilePicture,
      authorAbout: body.authorAbout,
      authorName: body.authorName,
      publisher: body.publisher,
      publishedDate: body.publishedDate,
      language: body.language,
      noOfExercises: body.noOfExercises,
      noOfArticles: body.noOfArticles,
      printLength: body.printLength,
      compatibleBrowsers: body.compatibleBrowsers,
      layout: body.layout,
    };

    if (!Object.values(CategoryTypeEnum).includes(body.category)) {
      product.isCustomCategory = true;
    }

    const newProduct = await this.productService.create(product);

    return h
      .response({
        statusCode: 200,
        data: newProduct,
        message: "Product created successFully",
      })
      .code(200);
  }

  async update(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const productUpdate: Partial<Product> = {
      ...(body.category && { category: body.category }),
      ...(body.price && { price: body.price }),
      ...(body.name && { name: body.name }),
      ...(body.platform && { platform: body.platform }),
      ...(body.brand && { brand: body.brand }),
      ...(body.description && { description: body.description }),
      ...(body.about && { about: body.about }),
      ...(body.displayMedia && { displayMedia: body.displayMedia }),
      ...(body.orignalMedia && { orignalMedia: body.orignalMedia }),
      ...(body.status && { status: body.status }),
      ...(body.formate && { formate: body.formate }),
      ...(body.sellerReceive && { sellerReceive: body.sellerReceive }),
      ...(body.size && { size: body.size }),
      ...(body.dimension && { dimension: body.dimension }),
      ...(body.frameRate && { frameRate: body.frameRate }),
      ...(body.resolution && { resolution: body.resolution }),
      ...(body.itemPartNumber && { itemPartNumber: body.itemPartNumber }),
      ...(body.countryOfOrigin && { countryOfOrigin: body.countryOfOrigin }),
      ...(body.fontFor && { fontFor: body.fontFor }),
      ...(body.tags && { tags: body.tags }),
      ...(body.profilePicture && { profilePicture: body.profilePicture }),
      ...(body.authorAbout && { authorAbout: body.authorAbout }),
      ...(body.authorName && { authorName: body.authorName }),
      ...(body.publisher && { publisher: body.publisher }),
      ...(body.publishedDate && { publishedDate: body.publishedDate }),
      ...(body.language && { language: body.language }),
      ...(body.noOfExercises && { noOfExercises: body.noOfExercises }),
      ...(body.noOfArticles && { noOfArticles: body.noOfArticles }),
      ...(body.printLength && { printLength: body.printLength }),
      ...(body.compatibleBrowsers && {
        compatibleBrowsers: body.compatibleBrowsers,
      }),
      ...(body.layout && { layout: body.layout }),
    };

    const newProduct = await this.productService.update(
      body.productId,
      productUpdate
    );

    return h
      .response({
        statusCode: 200,
        data: newProduct,
        message: "Products sent successFully",
      })
      .code(200);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    await this.productService.delete(body.productId);

    return h
      .response({
        statusCode: 201,
        message: "Product deleted successFully",
      })
      .code(201);
  }
}
