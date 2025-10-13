import container from "dependency/container";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import {
  createPostValidator,
  deletePostValidator,
  getPostsValidator,
  updatePostValidator,
} from "@/api/validators/post.validator";
import { ReportController } from "@/api/controllers/report.controller";
import {
  createReportValidator,
  deleteReportValidator,
  getReportsCountValidator,
  getReportsValidator,
  updateReportValidator,
} from "../validators/report.validator";

const baseUrl = "/api/report";

const reportController =
  container.resolve<ReportController>("ReportController");

const reportRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getReportsValidator,
      },
    },
    handler: reportController.get.bind(reportController),
  },
  {
    method: "GET",
    path: `${baseUrl}/counts`,
    options: {
      validate: {
        query: getReportsCountValidator,
      },
    },
    handler: reportController.getCounts.bind(reportController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createReportValidator,
      },
    },
    handler: reportController.create.bind(reportController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: updateReportValidator,
      },
    },
    handler: reportController.update.bind(reportController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deleteReportValidator,
      },
    },
    handler: reportController.delete.bind(reportController),
  },
];

export default {
  name: "report-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of reportRoutes) {
      server.route(route);
    }
  },
};
