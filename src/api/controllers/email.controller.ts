import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { IEmailService } from "@/domain/interface/service/email.service.interface";
import { env } from "@/config/env";
import { Email } from "@/domain/entities/email.entity";

@injectable()
export class EmailController {
  constructor(
    @inject("EmailService")
    private emailService: IEmailService
  ) {}

  async send(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const email: Email = {
      from: env.FROM_EMAIL,
      to: body.toEmail,
      subject: body.subject,
      text: body.text,
      html: body.text,
    };

    await this.emailService.send(email);

    return h
      .response({
        statusCode: 201,
        message: "email Send successfully",
      })
      .code(201);
  }
}
