'use client';
import React from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../../auth/enums';
import { useTranslations } from 'next-intl';
import { Button } from '../../commons/Buttons/Button';
import styled from '@emotion/styled';

const Root = styled.ul`
  display: flex;
  align-items: center;
`;

interface Props {
  onClick: (variant: ENUM_AUTH_FORM_VARIANT) => void;
}

export const AuthMenu = ({ onClick }: Props) => {
  const t = useTranslations();
  return (
    <Root>
      <li>
        <Button
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #fff',
            borderRadius: '8px',
            padding: '8px 15px',
          }}
          onClick={() => onClick(ENUM_AUTH_FORM_VARIANT.SIGNIN)}>
          {t('authCommons.signIn')}
        </Button>
      </li>
      <li>
        <Button
          style={{
            border: '1px solid transparent',
            borderRadius: '8px',
            padding: '8px 15px',
          }}
          onClick={() => onClick(ENUM_AUTH_FORM_VARIANT.REGISTER)}>
          {t('authCommons.register')}
        </Button>
      </li>
    </Root>
  );
};
