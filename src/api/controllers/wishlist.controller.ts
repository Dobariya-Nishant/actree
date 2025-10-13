import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { IWishListService } from "@/domain/interface/service/wishlist.service.interface";
import { generateObjectId, getObjectId } from "@/domain/helpers/util";

@injectable()
export class WishListController {
  constructor(
    @inject("WishListService")
    private wishListService: IWishListService
  ) {}

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;

    const { credentials: user } = request.auth as any;

    const wishList = await this.wishListService.get({
      userId: user._id,
      ...(query.createdAt && { createdAt: new Date(query.createdAt) }),
    });

    return h
      .response({
        statusCode: 200,
        data: wishList,
        message: "WishList send successFully",
      })
      .code(200);
  }

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    //@ts-ignore
    const wishList: WishList = {
      _id: generateObjectId(),
      userId: user._id,
      productId: body.productId,
    };

    await this.wishListService.create(wishList);

    return h
      .response({
        statusCode: 201,
        message: "WishList created successFully",
      })
      .code(201);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;
    await this.wishListService.delete(user._id, body.productId);

    return h
      .response({
        statusCode: 200,
        message: "WishList deleted successFully",
      })
      .code(200);
  }
}
