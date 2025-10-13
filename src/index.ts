import "reflect-metadata";
import { registerServer } from "@/api/server";
import { mountCriticalErrorHandlers } from "@/domain/helpers/globalErrorHandler";
import { dbConnect } from "@/infrastructure/database/client/db";

async function init() {
  try {
    const server = await registerServer();
    await dbConnect();
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (err) {
    console.log(err);
  }
}

mountCriticalErrorHandlers();

init();
