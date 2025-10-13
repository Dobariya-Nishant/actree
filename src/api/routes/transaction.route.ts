import { Server, ServerRoute } from "@hapi/hapi";
import container from "@/dependency/container";
import { TransactionController } from "@/api/controllers/transaction.controller";
import {
  checkOutValidator,
  getAnalyticsValidator,
  getTransactionsValidator,
} from "@/api/validators/transaction.validator";

const basePath = "/api/transaction";

const transactionController = container.resolve<TransactionController>(
  "TransactionController"
);

const transactionRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: `${basePath}/account-create`,
    handler: transactionController.createAccount.bind(transactionController),
  },
  {
    method: "GET",
    path: `${basePath}/account-status`,
    handler: transactionController.accountStatus.bind(transactionController),
  },
  {
    method: "POST",
    path: `${basePath}/checkout`,
    options: {
      validate: {
        payload: checkOutValidator,
      },
    },
    handler: transactionController.checkOut.bind(transactionController),
  },
  {
    method: "GET",
    path: `${basePath}`,
    options: {
      validate: {
        query: getTransactionsValidator,
      },
    },
    handler: transactionController.get.bind(transactionController),
  },
  {
    method: "GET",
    path: `${basePath}/dashboard`,
    handler: transactionController.dashboard.bind(transactionController),
  },
  {
    method: "GET",
    path: `${basePath}/analytics`,
    options: {
      validate: {
        query: getAnalyticsValidator,
      },
    },
    handler: transactionController.analytics.bind(transactionController),
  },
  {
    method: "POST",
    path: `${basePath}/webhook`,
    options: {
      payload: {
        parse: false,
      },
      auth: false,
    },
    handler: transactionController.checkOutSuccess.bind(transactionController),
  },
];

export default {
  name: "transaction-routes",
  register: async (server: Server) => {
    server.route(transactionRoutes);
  },
};
