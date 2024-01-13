'use client';

import React, { useState } from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../auth/enums';
import { useTranslations } from 'next-intl';
import { ForgetPassword } from './ForgetPassword';
import { AuthForm } from './register/AuthForm';

interface Props {
  onSuccess?: () => void;
  variant: ENUM_AUTH_FORM_VARIANT;
}

export const AuthPage = ({ onSuccess, variant }: Props) => {
  const t = useTranslations();
  const [forgotMenu, setForgotMenu] = useState(false);

  return (
    <>
      {t(`authCommons.${variant}`)}
      {forgotMenu ? (
        <ForgetPassword onForgetMenu={setForgotMenu} onCloseAll={onSuccess} />
      ) : (
        <AuthForm
          onSuccess={onSuccess}
          variant={variant}
          onForgetMenu={setForgotMenu}
        />
      )}
    </>
  );
};
