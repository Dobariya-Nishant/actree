import { config } from "dotenv";

config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://localhost:27017/user-service",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://192.168.0.110:3000",
  X_API_KEY: process.env.X_API_KEY || "",
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || "",
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY || "",
  PASSWORD_PRIVATE_KEY: process.env.PASSWORD_PRIVATE_KEY || "",
  PASSWORD_PUBLIC_KEY: process.env.PASSWORD_PUBLIC_KEY || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL || "",
  GOOGLE_REDIRECT_BUSINESS_URL: process.env.GOOGLE_REDIRECT_BUSINESS_URL || "",
  SEND_GRID_EMAIL_API_KEY: process.env.SEND_GRID_EMAIL_API_KEY || "",
  FROM_EMAIL: process.env.FROM_EMAIL || "",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
};
