import { JwtPayload } from "@/domain/entities/jwt.entity";

export interface IAuthService {
  createSessionToken(tokenPayload: JwtPayload): string;

  verifySessionToken(token: string): JwtPayload;

  encryptPassword(password: string): string;

  verifyPassword(password: string, signature: string): Boolean;

  generateOTP(length?: number): {
    otp: string;
    expirationTime: number;
  };

  verifyOTP(
    inputOtp: string,
    generatedOtp: string,
    expirationTime: number
  ): { success: boolean; message: string };
}
