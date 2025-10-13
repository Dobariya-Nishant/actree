import container from "dependency/container";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { CommentController } from "@/api/controllers/comment.controller";
import {
  createCommentValidator,
  deleteCommentValidator,
  getCommentsValidator,
  updateCommentValidator,
} from "@/api/validators/comment.validator";

const baseUrl = "/api/media/comment";

const commentController =
  container.resolve<CommentController>("CommentController");

const commentRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getCommentsValidator,
      },
    },
    handler: commentController.get.bind(commentController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createCommentValidator,
      },
    },
    handler: commentController.create.bind(commentController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: updateCommentValidator,
      },
    },
    handler: commentController.update.bind(commentController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deleteCommentValidator,
      },
    },
    handler: commentController.delete.bind(commentController),
  },
];

export default {
  name: "comment-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of commentRoutes) {
      server.route(route);
    }
  },
};
