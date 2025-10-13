import {
  Plugin,
  Request,
  ResponseToolkit,
  Server,
  ServerApplicationState,
} from "@hapi/hapi";
import container from "@/dependency/container";
import { env } from "@/config/env";
import { IUserService } from "@/domain/interface/service/user.service.interface";

export default {
  name: "auth-strategy",
  register: async (server: Server<ServerApplicationState>) => {
    server.auth.strategy("jwt", "jwt", {
      key: env.JWT_PUBLIC_KEY,
      validate: async (decoded: any, request: Request, h: ResponseToolkit) => {
        try {
          if (decoded.isApi) {
            return { isValid: true };
          }

          const userService = container.resolve<IUserService>("UserService");

          const user = await userService.getOne({
            userId: decoded.userId,
          });

          const token = user?.sessions?.find(
            //@ts-ignore
            (obj) => obj.token === request?.auth?.token
          );

          if (!user || !token) {
            return { isValid: false };
          }

          //@ts-ignore
          // if (request?.route?.settings?.auth?.access?.[0]?.scope?.selection) {
          //   const scope = //@ts-ignore
          //     request?.route?.settings?.auth?.access[0]?.scope?.selection;
          //   if (Array.isArray(scope) && !scope.includes(user.role)) {
          //     return { isValid: false };
          //   }
          // }

          return { isValid: true, credentials: user };
        } catch (error) {
          // console.error("JWT validation error:", error);
          return { isValid: false };
        }
      },
    });

    server.auth.default("jwt");
  },
};
