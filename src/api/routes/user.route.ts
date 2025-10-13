import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import container from "dependency/container";
import {
  deleteUserValidator,
  getUserProfileValidator,
  getUsersValidator,
  loginValidator,
  oAuthCallBackValidator,
  oAuthValidator,
  userSignUpValidator,
  userUpdateValidator,
} from "@/api/validators/user.validator";
import { UserController } from "@/api/controllers/user.controller";

const baseUrl = "/api/user";

const userController = container.resolve<UserController>("UserController");

const userRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getUserProfileValidator,
      },
    },
    handler: userController.profile.bind(userController),
  },
  {
    method: "GET",
    path: `${baseUrl}/suggest`,
    handler: userController.getSuggestedUsers.bind(userController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: getUsersValidator,
      },
    },
    handler: userController.get.bind(userController),
  },
  {
    method: "POST",
    path: `${baseUrl}/sign-up`,
    options: {
      validate: {
        payload: userSignUpValidator,
      },
      auth: false,
    },
    handler: userController.signUp.bind(userController),
  },
  {
    method: "POST",
    path: `${baseUrl}/login`,
    options: {
      validate: {
        payload: loginValidator,
      },
      auth: false,
    },
    handler: userController.login.bind(userController),
  },
  {
    method: "GET",
    path: `${baseUrl}/login/oauth`,
    options: {
      validate: {
        query: oAuthValidator,
      },
      auth: false,
    },
    handler: userController.oAuthRedirect.bind(userController),
  },
  {
    method: "GET",
    path: `${baseUrl}/login/callback/google`,
    options: {
      validate: {
        query: oAuthCallBackValidator,
      },
      auth: false,
    },
    handler: userController.oAuthCallBack.bind(userController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}/logout`,
    handler: userController.logout.bind(userController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: userUpdateValidator,
      },
    },
    handler: userController.update.bind(userController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deleteUserValidator,
      },
    },
    handler: userController.delete.bind(userController),
  },
];

export default {
  name: "user-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of userRoutes) {
      server.route(route);
    }
  },
};
