'use server';
import nodemailer from 'nodemailer';
import { APIResponse } from '@/src/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { templates } from './templates';
import { IContactMail } from './type';

export async function POST(request: NextRequest) {
  const props = (await request.json()) as IContactMail;
  const { email, subject, mailSystem, token } = props;

  try {
    const checkPayload = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_CAPTCHA_SERVER_KEY}&response=${token}`
    );
    const captchaPayload = await checkPayload.json();
    if (!captchaPayload.success) {
      return NextResponse.json<APIResponse<string>>({ status: 500, success: false, error: 'You are a roboot', data: null });
    }
    const transporter = nodemailer.createTransport({
      host: 'mail.gandi.net',
      port: 587,
      secure: false,
      auth: {
        user: mailSystem,
        pass: process.env.NEXT_MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"RartCreation" <${mailSystem}>`,
      to: email,
      subject,
      html: templates.successContactForm(props),
    });
    await transporter.sendMail({
      from: `"RartCreation" <${mailSystem}>`,
      to: [mailSystem, 'contact@rartcreation.fr'],
      subject,
      html: templates.contactMail(props),
    });

    return NextResponse.json<APIResponse<string>>({ status: 200, error: null, success: true, data: 'Contact.success' });
  } catch (error: any) {
    return NextResponse.json<APIResponse<string>>({ status: 500, success: false, error: error.message, data: null });
  }
}
