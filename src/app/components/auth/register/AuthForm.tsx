'use client';

import emotionStyled from '@emotion/styled';
import React, { FormEvent, useState } from 'react';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { ENUM_AUTH_FORM_VARIANT } from '../enums';
import { useTranslations } from 'next-intl';
import { UserCredential } from 'firebase/auth';
import { ApiPayload } from '@/src/app/contexts/shared/types';
import { Button } from '../../commons/Buttons/Button';
import { InputGroup } from '../../commons/form/InputGroup';

const Form = emotionStyled.form``;

interface Props {
  onSuccess?: (credentials?: UserCredential) => void;
  variant: ENUM_AUTH_FORM_VARIANT;
  onForgetMenu: (state: boolean) => void;
}

export const AuthForm = ({ onSuccess, variant, onForgetMenu }: Props) => {
  const router = useRouter();
  const { onRegister, signInWithEmailPassword } = useAuth();
  const t = useTranslations();

  const prevRoute = useSearchParams().get('from');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email: string | undefined = (event.target as any).email?.value;
    const password: string | undefined = (event.target as any).password?.value;

    if (!email || !password) return undefined;

    try {
      let payload: ApiPayload = {
        error: null,
        status: false,
        code: '',
        message: null,
      };
      if (variant === ENUM_AUTH_FORM_VARIANT.REGISTER) {
        payload = await onRegister({
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
        onSuccess?.(payload.data);
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
    <Form onSubmit={handleSubmit}>
      {errorMessage ? <span>{errorMessage}</span> : null}
      <InputGroup id='email' name='email' label={t('Authform.email')} />
      <InputGroup
        type='password'
        id='password'
        name='password'
        label={t('Authform.password')}
      />
      <Button type='submit'> {t(`authCommons.${variant}`)}</Button>
    </Form>
  );
};
