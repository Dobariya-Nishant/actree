import { injectable } from "tsyringe";
import { QueryOptions } from "mongoose";
import { OTPModel } from "@/infrastructure/database/models/otp.model";
import { OTP } from "@/domain/entities/otp.entity";
import { IOtpRepository } from "@/domain/interface/repositories/otp.repository.interface";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { otpError } from "@/domain/messages/error/otp.error";

@injectable()
export class OtpRepository implements IOtpRepository {
  async get({
    email,
    otpId,
  }: {
    email?: string;
    otpId?: string;
  }): Promise<OTP> {
    if (!email && !otpId) {
      throw new UnprocessableEntityError(otpError.GET_QUERY);
    }

    const query: QueryOptions = {};

    if (email) {
      query["email"] = email;
    }

    if (otpId) {
      query["otpId"] = otpId;
    }

    const otp = await OTPModel.findOne(query);

    if (!otp) {
      throw new NotFoundError(otpError.NOT_EXIST);
    }

    return otp;
  }

  create(otp: OTP): Promise<OTP> {
    return OTPModel.findOneAndUpdate(
      { email: otp.email },
      {
        otp: otp.otp,
        expirationTime: otp.expirationTime,
        isVerified: false,
      },
      {
        new: true,
        upsert: true,
      }
    );
  }

  async markVerified(email: string): Promise<OTP> {
    const otp = await OTPModel.findOneAndUpdate(
      { email: email },
      {
        isVerified: true,
      },
      {
        new: true,
      }
    );

    if (!otp) {
      throw new NotFoundError(otpError.NOT_EXIST);
    }

    return otp;
  }

  async delete(email: string): Promise<OTP> {
    const otp = await OTPModel.findOneAndDelete({ email });

    if (!otp) {
      throw new NotFoundError(otpError.NOT_EXIST);
    }

    return otp;
  }
}
