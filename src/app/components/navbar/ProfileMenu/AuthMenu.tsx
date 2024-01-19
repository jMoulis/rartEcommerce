'use client';
import React from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../../auth/enums';
import { useTranslations } from 'next-intl';
import { Button } from '../../commons/Buttons/Button';

interface Props {
  onClick: (variant: ENUM_AUTH_FORM_VARIANT) => void;
}

export const AuthMenu = ({ onClick }: Props) => {
  const t = useTranslations();

  return (
    <nav>
      <ul>
        <li>
          <Button onClick={() => onClick(ENUM_AUTH_FORM_VARIANT.SIGNIN)}>
            {t('authCommons.signIn')}
          </Button>
        </li>
        <li>
          <Button onClick={() => onClick(ENUM_AUTH_FORM_VARIANT.REGISTER)}>
            {t('authCommons.register')}
          </Button>
        </li>
      </ul>
    </nav>
  );
};
