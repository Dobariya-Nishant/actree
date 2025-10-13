import { injectable } from "tsyringe";
import { AuthTypeEnum, UserTypeEnum } from "@/domain/enum/user.enum";
import { googleOauthURL } from "@/infrastructure/oauth/google/oauth_urls";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";

@injectable()
export class OAuthService {
  getOauthUrl(authType: AuthTypeEnum, userType: UserTypeEnum): string {
    switch (authType) {
      case AuthTypeEnum.GOOGLE:
        return googleOauthURL(userType);
      case AuthTypeEnum.FACEBOOK:
        return googleOauthURL(userType);
      case AuthTypeEnum.APPLE:
        return googleOauthURL(userType);
      default:
        throw new UnprocessableEntityError("Auth type is not supported");
    }
  }

  // oauthRedirectUrl(authType: AuthTypeEnum, code: string): string {
  //   switch (authType) {
  //     case AuthTypeEnum.GOOGLE:
  //       return;
  //     case AuthTypeEnum.FACEBOOK:
  //       return;
  //     case AuthTypeEnum.APPLE:
  //       return;
  //     default:
  //       throw new UnprocessableEntityError("Auth type is not supported");
  //   }
  // }
}
