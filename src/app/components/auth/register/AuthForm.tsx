'use client';

import emotionStyled from '@emotion/styled';
import React, { FormEvent, useState } from 'react';
import { register, signInWithEmailPassword } from '@/src/lib/firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import SignIn from '../sign-in/SignIn';

const Form = emotionStyled.form``;

type Props = {
  onSuccess?: () => void;
  variant?: 'register' | 'signIn';
};

export const AuthForm = ({ onSuccess, variant }: Props) => {
  const router = useRouter();
  const prevRoute = useSearchParams().get('from');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email: string | undefined = (event.target as any).email?.value;
    const password: string | undefined = (event.target as any).password?.value;

    if (!email || !password) return null;

    try {
      let payload: {
        error: string | null;
        status: boolean;
      } = {
        error: null,
        status: false,
      };
      if (variant === 'register') {
        payload = await register({
          email,
          password,
        });
      } else if (variant === 'signIn') {
        payload = await signInWithEmailPassword({
          email,
          password,
        });
      }
      if (payload.status) {
        onSuccess?.();
        setErrorMessage(null);
        router.push(prevRoute || '/');
      } else if (payload.error) {
        throw Error(payload.error);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      {variant}
      <Form onSubmit={handleSubmit}>
        {errorMessage ? <span>{errorMessage}</span> : null}
        <label>
          <span>Identifiant</span>
          <input id='email' />
        </label>
        <label>
          <span>Mot de passe</span>
          <input type='password' id='password' />
        </label>
        <button type='submit'>{variant}</button>
      </Form>
      <SignIn onSuccess={onSuccess} />
    </>
  );
};
