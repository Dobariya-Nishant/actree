import { env } from "@/config/env";
import { UserTypeEnum } from "@/domain/enum/user.enum";
import { NotFoundError } from "@/domain/errors/app-errors";

export function googleOauthURL(userType: UserTypeEnum) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  let redirectUrl: string;

  switch (userType) {
    case UserTypeEnum.INDIVIDUAL:
      redirectUrl = env.GOOGLE_REDIRECT_URL;
      break;
    case UserTypeEnum.BUSINESS:
      redirectUrl = env.GOOGLE_REDIRECT_BUSINESS_URL;
      break;
    default:
      throw new NotFoundError("User type not found");
  }

  const options = {
    redirect_uri: redirectUrl,
    client_id: env.GOOGLE_CLIENT_ID,
    response_type: "code",
    state: userType,
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}
