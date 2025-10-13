import { env } from "@/config/env";
import { SESClient } from "@aws-sdk/client-ses";

// Create SES service object.
const sesClient = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export { sesClient };
