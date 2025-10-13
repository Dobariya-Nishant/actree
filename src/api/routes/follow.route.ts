import { container } from "tsyringe";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { FollowController } from "@/api/controllers/follow.controller";
import {
  acceptFollowValidator,
  createFollowValidator,
  deleteFollowValidator,
  getFollowValidator,
} from "@/api/validators/follow.validator";

const baseUrl = "/api/user/follow";

const followController =
  container.resolve<FollowController>("FollowController");

const followRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getFollowValidator,
      },
    },
    handler: followController.get.bind(followController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createFollowValidator,
      },
    },
    handler: followController.create.bind(followController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: acceptFollowValidator,
      },
    },
    handler: followController.accept.bind(followController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deleteFollowValidator,
      },
    },
    handler: followController.delete.bind(followController),
  },
];

export default {
  name: "follow-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of followRoutes) {
      server.route(route);
    }
  },
};
