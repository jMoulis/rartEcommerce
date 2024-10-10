import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { templates } from './templates';

export class MailService {
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  mailSystem?: string;

  constructor() {
    this.mailSystem = process.env.NEXT_PUBLIC_MAIL_SYSTEM;
    this.transporter = nodemailer.createTransport({
      host: process.env.NEXT_MAIL_HOST,
      port: process.env.NEXT_MAIL_PORT as any,
      secure: false,
      auth: {
        user: this.mailSystem,
        pass: process.env.NEXT_MAIL_PASSWORD,
      },
    });
  }

  getTransport() {
    return this.transporter;
  }

  async sendEmail({
    email,
    subject,
    template: {
      name,
      props
    },
    files
  }: {
    email: string, subject: string, template: {
      name: 'successContactForm' | 'contactMail' | 'paymentSuccess';
      props: any
    },
    files?: Array<{ content: Buffer, contentType: string, filename: string }>
  }) {
    try {
      const payload = await this.transporter.sendMail({
        from: `"RartCreation" <${this.mailSystem}>`,
        to: email,
        subject,
        html: templates[name]?.(props),
        attachments: files
      });
      return payload;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
