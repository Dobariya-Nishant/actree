import { injectable } from "tsyringe";
import { sesClient } from "@/infrastructure/email/aws/client";
import { Email } from "@/domain/entities/email.entity";
import { IEmailService } from "@/domain/interface/service/email.service.interface";
import { env } from "@/config/env";
import {
  changeEmailTemplate,
  signupOtpTemplate,
  verifyPasswordTemplate,
} from "@/domain/templates/emails/otp.email";
import { OtpTypeEnum } from "@/domain/enum/email.enum";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { SendEmailCommand } from "@aws-sdk/client-ses";

@injectable()
export class EmailService implements IEmailService {
  constructor() {}

  async send(email: Email): Promise<void> {
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [email.to],
      },
      Message: {
        Body: {
          // Text: { Data: email.text },
          Html: { Data: email.html },
        },
        Subject: { Data: email.subject },
      },
      Source: "info@activatree.com",
    });
    await sesClient.send(command);
  }

  async sendOtp(to: string, otp: string, template: OtpTypeEnum): Promise<void> {
    let html: string;
    let subject: string;
    let text: string;

    switch (template) {
      case OtpTypeEnum.SIGNUP:
        html = signupOtpTemplate(otp);
        subject = "OTP for email registration";
        text = "OTP for email registration";
        break;
      case OtpTypeEnum.CHANGE_PASSWORD:
        html = verifyPasswordTemplate(otp);
        subject = "OTP for reset password";
        text = "OTP for reset password";
        break;
      case OtpTypeEnum.CHANGE_EMAIL:
        html = changeEmailTemplate(otp);
        subject = "OTP for change email";
        text = "OTP for change email";
        break;
      default:
        throw new UnprocessableEntityError(`${template} is not supported!`);
    }

    const email: Email = {
      from: env.FROM_EMAIL,
      to,
      subject,
      text,
      html,
    };

    await this.send(email);
  }
}
