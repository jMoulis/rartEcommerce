'use client';
import React from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../../auth/enums';
import { useTranslations } from 'next-intl';
import { Button } from '../../commons/Buttons/Button';
import styled from '@emotion/styled';

const Root = styled.ul`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;
const CustomButton = styled(Button)`
  background-color: transparent;
  border: none;
  padding: 3px;
  margin: 0;
  &:hover {
    background-color: transparent;
    text-decoration: underline;
    text-underline-offset: 6px; // Add space between underline and text
  }
`;
interface Props {
  onClick: (variant: ENUM_AUTH_FORM_VARIANT) => void;
}

export const AuthMenu = ({ onClick }: Props) => {
  const t = useTranslations();
  return (
    <Root>
      <li>
        <CustomButton
          style={{
            marginRight: '5px',
          }}
          onClick={() => onClick(ENUM_AUTH_FORM_VARIANT.SIGNIN)}>
          {t('authCommons.signIn')}
        </CustomButton>
      </li>
      <li>
        <CustomButton onClick={() => onClick(ENUM_AUTH_FORM_VARIANT.REGISTER)}>
          {t('authCommons.register')}
        </CustomButton>
      </li>
    </Root>
  );
};
