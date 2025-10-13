import { OTP } from "@/domain/entities/otp.entity";
import { OtpTypeEnum } from "@/domain/enum/email.enum";

export interface IOtpService {
  create(email: string, type: OtpTypeEnum): Promise<OTP>;

  verify(email: string, otp: string): Promise<boolean>;

  isVerified(email: string): Promise<boolean>;

  delete(email: string): Promise<void>;
}
