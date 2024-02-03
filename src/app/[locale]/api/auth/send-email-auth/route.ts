'use server';
import nodemailer from 'nodemailer';
import { APIResponse } from '@/src/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { IEmailVerif } from './types';
import crypto from 'crypto';
import { templates } from './templates';
import { onRootUpdateDocument } from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';

export async function POST(request: NextRequest) {
  const props = (await request.json()) as IEmailVerif;
  const { email, subject, mailSystem, userId } = props;
  const generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };
  const token = generateToken();

  const domain = process.env.NEXT_DOMAIN;

  try {
    await onRootUpdateDocument({ token, verified: false }, ENUM_COLLECTIONS.PROFILES, userId);

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
      html: templates.verifyAccount({
        ...props,
        linkToken: `${domain}/verify?token=${token}&email=${email}`
      })

    });
    return NextResponse.json<APIResponse<string>>({ status: 200, error: null, success: true, data: token });
  } catch (error: any) {
    return NextResponse.json<APIResponse<string>>({ status: 500, success: false, error: error.message, data: null });
  }
}
