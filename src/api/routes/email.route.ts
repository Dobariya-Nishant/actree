import container from "dependency/container";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { emailValidator } from "../validators/email.validator";
import { EmailController } from "../controllers/email.controller";

const baseUrl = "/api/email";

const emailController = container.resolve<EmailController>("EmailController");

const emailRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: emailValidator,
      },
    },
    handler: emailController.send.bind(emailController),
  },
];

export default {
  name: "email-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of emailRoutes) {
      server.route(route);
    }
  },
};
