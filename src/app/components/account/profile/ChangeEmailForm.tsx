'use client';

import emotionStyled from '@emotion/styled';
import { Dialog } from '@mui/material';
import React, { FormEvent } from 'react';
import { useToggle } from '../../hooks/useToggle';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '../../commons/Buttons/Button';

const Form = emotionStyled.form`
  display: flex;
  flex-direction: column;
`;

interface Props {
  email: string;
  onChangeEmailValue: (newEmail: string) => void;
}

export const ChangeEmailForm = ({ email, onChangeEmailValue }: Props) => {
  const { open, onOpen, onClose } = useToggle();
  const { onUpdateEmail, onPromptForCredentials, onSignOut } = useAuth();
  const router = useRouter();
  const handleReauthSuccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email: string | undefined = (event.target as any)['auth-email']
      ?.value;
    const password: string | undefined = (event.target as any)['auth-password']
      ?.value;
    if (email && password) {
      await onPromptForCredentials({
        email,
        password,
      });
      onClose();
      if (email) {
        const payload = await onUpdateEmail(email);
        if (payload.status) {
          await onSignOut();
          router.push('/');
        }
      }
    }
  };

  return (
    <>
      <label htmlFor='email'>
        Email
        <input
          id='email'
          name='email'
          value={email || ''}
          onChange={(event) => onChangeEmailValue(event.currentTarget.value)}
        />
      </label>
      <Button onClick={onOpen}>Change email</Button>
      <Dialog open={open}>
        <Form onSubmit={handleReauthSuccess}>
          <label htmlFor='avatar'>
            Email
            <input id='auth-email' name='email' />
          </label>
          <label htmlFor='avatar'>
            Password
            <input id='auth-password' type='password' name='password' />
          </label>
          <Button type='submit'>Reauth</Button>
        </Form>
      </Dialog>{' '}
    </>
  );
};
