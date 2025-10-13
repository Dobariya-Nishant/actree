import { Plugin, Server, ServerRoute } from "@hapi/hapi";
import container from "@/dependency/container";
import { WishListController } from "@/api/controllers/wishlist.controller";
import {
  createWishListValidator,
  deleteWishListValidator,
  getWishListsValidator,
} from "@/api/validators/wishlist.validator";

const basePath = "/api/marketplace/wishlist";

const wishListController =
  container.resolve<WishListController>("WishListController");

const productRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: `${basePath}`,
    options: {
      validate: {
        query: getWishListsValidator,
      },
    },
    handler: wishListController.get.bind(wishListController),
  },
  {
    method: "POST",
    path: `${basePath}`,
    options: {
      validate: {
        payload: createWishListValidator,
      },
    },
    handler: wishListController.create.bind(wishListController),
  },
  {
    method: "DELETE",
    path: `${basePath}`,
    options: {
      validate: {
        payload: deleteWishListValidator,
      },
    },
    handler: wishListController.delete.bind(wishListController),
  },
];

export default {
  name: "wishlist-routes",
  register: async (server: Server) => {
    server.route(productRoutes);
  },
};
