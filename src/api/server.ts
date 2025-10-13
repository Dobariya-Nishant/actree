import Hapi from "@hapi/hapi";
import JWT2 from "hapi-auth-jwt2";
import userRoutesPlugin from "@/api/routes/user.route";
import followRoutesPlugin from "@/api/routes/follow.route";
import otpRoutesPlugin from "@/api/routes/otp.route";
import authPlugin from "@/api/plugins/auth.plugin";
import postRoutes from "@/api/routes/post.route";
import rePostRoutes from "@/api/routes/repost.route";
import commentRoutes from "@/api/routes/comment.route";
import likeRoutes from "@/api/routes/like.route";
import bookMarkRoutes from "@/api/routes/bookmark.route";
import pinRoutes from "@/api/routes/pin.route";
import wishListRouterPlugin from "@/api/routes/wishlist.route";
import productRouterPlugin from "@/api/routes/product.route";
import transactionRoutes from "@/api/routes/transaction.route";
import reportRoutes from "@/api/routes/report.route";
import emailRoutes from "@/api/routes/email.route";
import notificationRoutes from "@/api/routes/notification.route";
import { ValidationError } from "joi";
import { AppError } from "@/domain/errors/app-errors";
import { env } from "@/config/env";
import { initSocket } from "@/infrastructure/web-socket/socket";

export async function registerServer() {
  const routes = [
    JWT2,
    authPlugin,
    userRoutesPlugin,
    followRoutesPlugin,
    otpRoutesPlugin,
    postRoutes,
    rePostRoutes,
    commentRoutes,
    likeRoutes,
    bookMarkRoutes,
    pinRoutes,
    productRouterPlugin,
    wishListRouterPlugin,
    transactionRoutes,
    emailRoutes,
    reportRoutes,
    notificationRoutes,
  ];

  const server = Hapi.server({
    port: env.PORT,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Content-Type", "Authorization", "X-Requested-With"],
      },
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        allow: ["multipart/form-data", "application/json"],
        maxBytes: 50 * 1024 * 1024,
        timeout: false,
      },
      validate: {
        failAction: async (request, h, err) => {
          if (err instanceof ValidationError) {
            const validationErrorString = err.details
              .map((detail) => `${detail?.context?.label}: ${detail.message}`)
              .join(", ");
            return h
              .response({
                statusCode: 400,
                error: err.name,
                message: validationErrorString,
              })
              .code(400)
              .takeover();
          }
        },
      },
    },
  });

  initSocket(server.listener);

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response instanceof AppError) {
      return h
        .response({
          statusCode: response.statusCode,
          error: response.name,
          message: response.message,
        })
        .code(response.statusCode)
        .takeover();
    }

    return h.continue;
  });

  server.listener;

  for (const route of routes) {
    //@ts-ignore
    await server.register(route);
  }

  return server;
}
