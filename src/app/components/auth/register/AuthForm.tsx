'use client';

import emotionStyled from '@emotion/styled';
import React, { FormEvent, useState } from 'react';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import SignIn from '../sign-in/SignIn';
import { ENUM_AUTH_FORM_VARIANT } from '../enums';
import { useTranslations } from 'next-intl';

const Form = emotionStyled.form``;

interface Props {
  onSuccess?: () => void;
  variant: ENUM_AUTH_FORM_VARIANT;

  onForgetMenu: (state: boolean) => void;
}

export const AuthForm = ({ onSuccess, variant, onForgetMenu }: Props) => {
  const router = useRouter();
  const { register, signInWithEmailPassword } = useAuth();
  const t = useTranslations();

  const prevRoute = useSearchParams().get('from');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email: string | undefined = (event.target as any).email?.value;
    const password: string | undefined = (event.target as any).password?.value;

    if (!email || !password) return undefined;

    try {
      let payload: {
        error: string | null;
        status: boolean;
      } = {
        error: null,
        status: false,
      };
      if (variant === ENUM_AUTH_FORM_VARIANT.REGISTER) {
        payload = await register({
          email,
          password,
        });
      } else if (variant === ENUM_AUTH_FORM_VARIANT.SIGNIN) {
        payload = await signInWithEmailPassword({
          email,
          password,
        });
      }
      if (payload.status) {
        onSuccess?.();
        setErrorMessage(null);
        router.push(prevRoute ?? '/');
      } else if (payload.error) {
        throw Error(payload.error);
      }
    } catch (error: any) {
      setErrorMessage(error.message as string);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {errorMessage ? <span>{errorMessage}</span> : null}
        <label htmlFor='email'>
          <span>{t('Authform.email')}</span>
          <input id='email' />
        </label>
        <label htmlFor='password'>
          <span>{t('Authform.password')}</span>
          <input type='password' id='password' />
        </label>
        <button type='submit'>{t('commons.create')}</button>
      </Form>
      <SignIn onSuccess={onSuccess} />
      <button type='button' onClick={() => onForgetMenu(true)}>
        {t('Authform.resetPassword')}
      </button>
    </>
  );
};
