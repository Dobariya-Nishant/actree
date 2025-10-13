import { AuthTypeEnum } from "@/domain/enum/user.enum";

export interface JwtPayload {
  userId: string;
  email: string;
  authType: AuthTypeEnum;
  sessionId: string;
  scope: Array<string>;
}
