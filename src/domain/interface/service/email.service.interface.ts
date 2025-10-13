import { Email } from "@/domain/entities/email.entity";
import { OtpTypeEnum } from "@/domain/enum/email.enum";

export interface IEmailService {
  send(email: Email): Promise<void>;

  sendOtp(to: string, otp: string, template: OtpTypeEnum): Promise<void>;
}
