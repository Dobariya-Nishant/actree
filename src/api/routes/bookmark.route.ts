import container from "dependency/container";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { BookMarkController } from "@/api/controllers/bookmark.controller";
import {
  createBookMarkValidator,
  deleteBookMarkValidator,
  getBookMarksValidator,
} from "@/api/validators/bookmark.validator";

const baseUrl = "/api/media/bookmark";

const bookMarkController =
  container.resolve<BookMarkController>("BookMarkController");

const bookMarkRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getBookMarksValidator,
      },
    },
    handler: bookMarkController.get.bind(bookMarkController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createBookMarkValidator,
      },
    },
    handler: bookMarkController.create.bind(bookMarkController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deleteBookMarkValidator,
      },
    },
    handler: bookMarkController.delete.bind(bookMarkController),
  },
];

export default {
  name: "bookmark-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of bookMarkRoutes) {
      server.route(route);
    }
  },
};
