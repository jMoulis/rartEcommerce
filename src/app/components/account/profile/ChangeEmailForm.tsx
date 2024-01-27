'use client';

import emotionStyled from '@emotion/styled';
import { Dialog } from '@mui/material';
import React, { FormEvent } from 'react';
import { useToggle } from '../../hooks/useToggle';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '../../commons/Buttons/Button';
import { InputGroup } from '../../commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../commons/Flexbox';
import { DialogHeader } from '../../commons/dialog/DialogHeader';

const Form = emotionStyled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

interface Props {
  email: string;
  onChangeEmailValue: (newEmail: string) => void;
}

export const ChangeEmailForm = ({ email, onChangeEmailValue }: Props) => {
  const { open, onOpen, onClose } = useToggle();
  const t = useTranslations();
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
      <Flexbox alignItems='center'>
        <InputGroup
          id='email'
          name='email'
          value={email || ''}
          onInputChange={(event) =>
            onChangeEmailValue(event.currentTarget.value)
          }
          label={t('ProfileForm.email')}
        />
        <Button onClick={onOpen}>{t('ProfileForm.editEmail')}</Button>
      </Flexbox>
      <Dialog open={open} onClose={onClose}>
        <DialogHeader title={t('ProfileForm.editEmail')} onClose={onClose} />
        <Form onSubmit={handleReauthSuccess}>
          <InputGroup
            id='auth-email'
            name='auth-email'
            label={t('ProfileForm.email')}
          />
          <InputGroup
            id='auth-password'
            name='auth-password'
            label={t('ProfileForm.password')}
          />
          <Flexbox justifyContent='flex-end'>
            <Button type='submit'>{t('ProfileForm.connect')}</Button>
          </Flexbox>
        </Form>
      </Dialog>
    </>
  );
};
