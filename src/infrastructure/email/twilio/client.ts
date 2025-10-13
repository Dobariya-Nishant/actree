import sendgrid from "@sendgrid/mail";
import { env } from "@/config/env";

sendgrid.setApiKey(env.SEND_GRID_EMAIL_API_KEY);

export default sendgrid;
