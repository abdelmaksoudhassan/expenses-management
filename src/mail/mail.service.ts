import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
// import { User } from './../user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string) {
    const url = `example.com/auth/confirm`;

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: email.split('@')[0],
        url,
      },
    });
  }
}