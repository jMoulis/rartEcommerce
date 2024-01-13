'use client';

import emotionStyled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';
import { useAuth } from '../../contexts/auth/hooks/useAuth';
import { Confirmation } from './Confirmation';

const Form = emotionStyled.form``;

interface Props {
  onForgetMenu: (state: boolean) => void;
  onCloseAll?: () => void;
}
export const ForgetPassword = ({ onForgetMenu, onCloseAll }: Props) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { resetPasswordEmail } = useAuth();
  const t = useTranslations();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email: string | undefined = (event.target as any)['email-forgot']
      ?.value;

    if (!email) return;
    try {
      const payload = await resetPasswordEmail(email);
      if (payload.status) {
        setShowConfirmation(true);
      } else {
        setShowConfirmation(false);
      }
    } catch (error) {}
  };

  return (
    <>
      {showConfirmation ? (
        <Confirmation onValidate={onCloseAll} />
      ) : (
        <>
          <Form onSubmit={handleSubmit}>
            <label htmlFor='email-forgot'>
              <span>{t('Authform.email')}</span>
              <input id='email-forgot' />
            </label>
            <button type='submit'>{t('Authform.sendResetPasswordLink')}</button>
          </Form>
          <button type='button' onClick={() => onForgetMenu(false)}>
            {t('authCommons.signIn')}
          </button>
        </>
      )}
    </>
  );
};
