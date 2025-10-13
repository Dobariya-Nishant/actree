import { Server, ServerRoute } from "@hapi/hapi";
import { ProductController } from "@/api/controllers/product.controller";
import container from "@/dependency/container";
import {
  createProductValidator,
  deleteProductValidator,
  getProductsValidator,
  updateProductStatusValidator,
  updateProductValidator,
} from "@/api/validators/product.validator";

const basePath = "/api/marketplace/product";

const productController =
  container.resolve<ProductController>("ProductController");

const productRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: `${basePath}`,
    options: {
      validate: {
        query: getProductsValidator,
      },
    },
    handler: productController.get.bind(productController),
  },
  {
    method: "POST",
    path: `${basePath}`,
    options: {
      validate: {
        payload: createProductValidator,
      },
    },
    handler: productController.create.bind(productController),
  },
  {
    method: "PATCH",
    path: `${basePath}/publish`,
    options: {
      validate: {
        payload: updateProductStatusValidator,
      },
      auth: {
        scope: ["admin"],
      },
    },
    handler: productController.update.bind(productController),
  },
  {
    method: "DELETE",
    path: `${basePath}`,
    options: {
      validate: {
        payload: deleteProductValidator,
      },
    },
    handler: productController.delete.bind(productController),
  },
  {
    method: "PATCH",
    path: `${basePath}`,
    options: {
      validate: {
        payload: updateProductValidator,
      },
    },
    handler: productController.update.bind(productController),
  },
];

export default {
  name: "product-routes",
  register: async (server: Server) => {
    server.route(productRoutes);
  },
};
