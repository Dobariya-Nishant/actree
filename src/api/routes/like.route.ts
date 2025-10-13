import container from "dependency/container";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { LikeController } from "@/api/controllers/like.controller";
import {
  createLikeValidator,
  deleteLikeValidator,
  getLikesValidator,
} from "@/api/validators/like.validator";

const baseUrl = "/api/media/like";

const likeController = container.resolve<LikeController>("LikeController");

const likeRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getLikesValidator,
      },
    },
    handler: likeController.get.bind(likeController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createLikeValidator,
      },
    },
    handler: likeController.create.bind(likeController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deleteLikeValidator,
      },
    },
    handler: likeController.delete.bind(likeController),
  },
];

export default {
  name: "like-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of likeRoutes) {
      server.route(route);
    }
  },
};
