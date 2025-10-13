import mongoose from "mongoose";
import { env } from "@/config/env";
import path from "path";

export async function dbConnect() {
  try {
    await mongoose.connect(env.DATABASE_URL, {
      tls: true,
      tlsCAFile: "/etc/ssl/global-bundle.pem",
      retryWrites: false,
      ssl: true,
      directConnection: true,
      tlsAllowInvalidHostnames: true,
      serverSelectionTimeoutMS: 10000,
      authMechanism: "SCRAM-SHA-1",
    });
    console.log("DB connected");
  } catch (error) {
    console.error("error while DB connection: ", error);
    process.exit(1);
  }
}
