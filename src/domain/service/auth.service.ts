import { injectable } from "tsyringe";
import { sign, verify } from "jsonwebtoken";
import { sign as cryptoSign, verify as cryptoVerify, constants } from "crypto";
import { env } from "@/config/env";
import { JwtPayload } from "@/domain/entities/jwt.entity";
import { IAuthService } from "@/domain/interface/service/auth.service.interface";

@injectable()
export class AuthService implements IAuthService {
  constructor() {}

  createSessionToken(tokenPayload: JwtPayload): string {
    const token = sign({ ...tokenPayload }, env.JWT_PRIVATE_KEY, {
      expiresIn: "10d",
      algorithm: "RS256",
    });
    return token;
  }

  verifySessionToken(token: string) {
    const payload = verify(token, env.JWT_PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    return payload as JwtPayload;
  }

  encryptPassword(password: string) {
    const signature = cryptoSign("RSA-SHA256", Buffer.from(password), {
      key: env.PASSWORD_PRIVATE_KEY,
      padding: constants.RSA_PKCS1_PADDING,
    });

    return signature.toString("base64");
  }

  verifyPassword(password: string, signature: string) {
    const isPassVerified = cryptoVerify(
      "RSA-SHA256",
      Buffer.from(password),
      { key: env.PASSWORD_PUBLIC_KEY, padding: constants.RSA_PKCS1_PADDING },
      Buffer.from(signature, "base64")
    );
    return isPassVerified;
  }

  generateOTP(length = 4) {
    const otp = Math.floor(1000 + Math.random() * 9000)
      .toString()
      .padStart(length, "0");

    const expiresIn = 5 * 60 * 1000;
    const expirationTime = Date.now() + expiresIn;

    return {
      otp,
      expirationTime,
    };
  }

  verifyOTP(inputOtp: string, generatedOtp: string, expirationTime: number) {
    const currentTime = Date.now();

    if (currentTime > expirationTime) {
      return { success: false, message: "OTP has expired" };
    }

    if (inputOtp === generatedOtp) {
      return { success: true, message: "OTP verified successfully" };
    }

    return { success: false, message: "Invalid OTP" };
  }
}
