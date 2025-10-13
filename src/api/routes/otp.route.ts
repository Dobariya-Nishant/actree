import { container } from "tsyringe";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { OtpController } from "@/api/controllers/otp.controller";
import {
  getOtpValidator,
  createOtpValidator,
  verifyOtpValidator,
  deleteOtpValidator,
} from "@/api/validators/otp.validator";

const baseUrl = "/api/user/otp";

const otpController = container.resolve<OtpController>("OtpController");

const otpRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getOtpValidator,
      },
      auth: false,
    },
    handler: otpController.get.bind(otpController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createOtpValidator,
      },
      auth: false,
    },
    handler: otpController.create.bind(otpController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: verifyOtpValidator,
      },
      auth: false,
    },
    handler: otpController.verify.bind(otpController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deleteOtpValidator,
      },
    },
    handler: otpController.delete.bind(otpController),
  },
];

export default {
  name: "otp-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of otpRoutes) {
      server.route(route);
    }
  },
};
