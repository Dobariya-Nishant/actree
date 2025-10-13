import { env } from "@/config/env";

export const awsUrls = {
  S3_BUCKET_URL: `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/`,
};
