import container from "dependency/container";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { PostController } from "@/api/controllers/post.controller";
import {
  createPostValidator,
  deletePostValidator,
  getPostsValidator,
  updatePostValidator,
} from "@/api/validators/post.validator";

const baseUrl = "/api/media/post";

const postController = container.resolve<PostController>("PostController");

const postRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getPostsValidator,
      },
    },
    handler: postController.get.bind(postController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createPostValidator,
      },
    },
    handler: postController.create.bind(postController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: updatePostValidator,
      },
    },
    handler: postController.update.bind(postController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deletePostValidator,
      },
    },
    handler: postController.delete.bind(postController),
  },
];

export default {
  name: "post-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of postRoutes) {
      server.route(route);
    }
  },
};
