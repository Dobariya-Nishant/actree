import { OTP } from "../../entities/otp.entity";

export interface IOtpRepository {
  get({ email, otpId }: { email?: string; otpId?: string }): Promise<OTP>;

  create(otp: OTP): Promise<OTP>;

  markVerified(email: string): Promise<OTP>;

  delete(email: string): Promise<OTP>;
}
