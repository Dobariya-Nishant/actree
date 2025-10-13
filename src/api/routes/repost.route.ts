import container from "dependency/container";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { RePostController } from "@/api/controllers/repost.controller";
import {
  createPostValidator,
  deletePostValidator,
  getPostsValidator,
  updatePostValidator,
} from "@/api/validators/post.validator";

const baseUrl = "/api/media/re-post";

const rePostController =
  container.resolve<RePostController>("RePostController");

const rePostRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getPostsValidator,
      },
    },
    handler: rePostController.get.bind(rePostController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createPostValidator,
      },
    },
    handler: rePostController.create.bind(rePostController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: updatePostValidator,
      },
    },
    handler: rePostController.update.bind(rePostController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deletePostValidator,
      },
    },
    handler: rePostController.delete.bind(rePostController),
  },
];

export default {
  name: "re-post-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of rePostRoutes) {
      server.route(route);
    }
  },
};
