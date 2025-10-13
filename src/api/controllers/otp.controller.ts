import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { IOtpService } from "@/domain/interface/service/otp.service.interface";
import { otpSuccess } from "@/domain/messages/success/otp.message";

@injectable()
export class OtpController {
  constructor(
    @inject("OtpService")
    private otpService: IOtpService
  ) {}

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;

    const isVerified = await this.otpService.isVerified(query.email);

    return h
      .response({
        statusCode: 200,
        data: { isVerified },
        message: otpSuccess.VERIFYED,
      })
      .code(200);
  }

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const otp = await this.otpService.create(body.email, body.type);

    return h
      .response({
        statusCode: 201,
        data: otp,
        message: otpSuccess.SENT,
      })
      .code(201);
  }

  async verify(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const otp = await this.otpService.verify(body.email, body.otp);

    return h
      .response({
        statusCode: 201,
        data: otp,
        message: otpSuccess.VERIFYED,
      })
      .code(201);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const otp = await this.otpService.delete(body.email);

    return h
      .response({
        statusCode: 201,
        data: otp,
        message: otpSuccess.DLETED,
      })
      .code(201);
  }
}
