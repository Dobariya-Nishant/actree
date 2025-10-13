import { OTP } from "@/domain/entities/otp.entity";
import mongoose, { Schema } from "mongoose";

const OtpSchema: Schema = new Schema<OTP>(
  {
    email: { type: String, unique: true },
    expirationTime: { type: Number },
    otp: { type: String },
    isVerified: { type: Boolean },
    createdAt: { type: Date, expires: 300, default: Date.now },
  },
  { timestamps: true }
);

export const OTPModel = mongoose.model<OTP>("Otp", OtpSchema);
