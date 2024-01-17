'use client';
import React from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../../auth/enums';
import { useTranslations } from 'next-intl';

interface Props {
  onClick: (variant: ENUM_AUTH_FORM_VARIANT) => void;
}

export const AuthMenu = ({ onClick }: Props) => {
  const t = useTranslations();

  return (
    <nav>
      <ul>
        <li>
          <button onClick={() => onClick(ENUM_AUTH_FORM_VARIANT.SIGNIN)}>
            {t('authCommons.signIn')}
          </button>
        </li>
        <li>
          <button onClick={() => onClick(ENUM_AUTH_FORM_VARIANT.REGISTER)}>
            {t('authCommons.register')}
          </button>
        </li>
      </ul>
    </nav>
  );
};
