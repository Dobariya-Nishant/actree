import container from "dependency/container";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { PinController } from "@/api/controllers/pin.controller";
import {
  createPinValidator,
  deletePinValidator,
  getPinsValidator,
} from "@/api/validators/pin.validator";

const baseUrl = "/api/media/pin";

const pinController = container.resolve<PinController>("PinController");

const bookMarkRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getPinsValidator,
      },
    },
    handler: pinController.get.bind(pinController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createPinValidator,
      },
    },
    handler: pinController.create.bind(pinController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deletePinValidator,
      },
    },
    handler: pinController.delete.bind(pinController),
  },
];

export default {
  name: "pin-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of bookMarkRoutes) {
      server.route(route);
    }
  },
};
