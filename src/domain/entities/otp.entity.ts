export interface OTP {
  email: string;
  expirationTime: number;
  otp: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
