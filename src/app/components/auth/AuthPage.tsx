'use client';

import React, { useState } from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../auth/enums';
import { useTranslations } from 'next-intl';
import { ForgetPassword } from './ForgetPassword';
import { AuthForm } from './register/AuthForm';
import SignIn from './sign-in/SignIn';

interface Props {
  onSuccess?: () => void;
  variant: ENUM_AUTH_FORM_VARIANT;
}

export const AuthPage = ({ onSuccess, variant }: Props) => {
  const t = useTranslations();
  const [forgotMenu, setForgotMenu] = useState(false);

  return (
    <>
      {forgotMenu ? (
        <ForgetPassword onForgetMenu={setForgotMenu} onCloseAll={onSuccess} />
      ) : (
        <>
          <AuthForm
            onSuccess={onSuccess}
            variant={ENUM_AUTH_FORM_VARIANT.SIGNIN}
            onForgetMenu={setForgotMenu}
          />
          <AuthForm
            onSuccess={onSuccess}
            variant={ENUM_AUTH_FORM_VARIANT.REGISTER}
            onForgetMenu={setForgotMenu}
          />
          <SignIn onSuccess={onSuccess} />
          <button type='button' onClick={() => setForgotMenu(true)}>
            {t('Authform.resetPassword')}
          </button>
        </>
      )}
    </>
  );
};
