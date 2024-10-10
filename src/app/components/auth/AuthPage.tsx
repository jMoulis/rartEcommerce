'use client';

import React, { useState } from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../auth/enums';
import { useTranslations } from 'next-intl';
import { ForgetPassword } from './ForgetPassword';
import { AuthForm } from './register/AuthForm';
import SignIn from './sign-in/SignIn';
import styled from '@emotion/styled';
import { OrSignWith } from './sign-in/OrSignWith';
import { ApiPayload } from '../../contexts/shared/types';

const Root = styled.div`
  height: 50vh;
  padding: 30px;
`;
const Header = styled.header`
  font-size: 25px;
`;
const FormsWrapper = styled.div`
  padding: 20px;
`;
interface Props {
  onSuccess?: (payload: ApiPayload) => void;
  variant: ENUM_AUTH_FORM_VARIANT;
  onChangeVariant?: React.Dispatch<
    React.SetStateAction<ENUM_AUTH_FORM_VARIANT>
  >;
  onCloseAll?: () => void;
}

export const AuthPage = ({
  onSuccess,
  variant,
  onChangeVariant,
  onCloseAll
}: Props) => {
  const t = useTranslations();
  const [forgotMenu, setForgotMenu] = useState(false);

  const handleOnSuccess = (payload: ApiPayload) => {
    onSuccess?.(payload);
  };
  const handleClose = () => {
    onCloseAll?.();
  };

  return (
    <Root>
      <Header>
        {t('Authform.signInTo', {
          company: 'Rart Création'
        })}
      </Header>
      {forgotMenu ? (
        <ForgetPassword
          onForgetMenu={() => setForgotMenu(true)}
          onCloseAll={handleClose}
        />
      ) : (
        <FormsWrapper>
          <SignIn onSuccess={handleOnSuccess} />\
          <OrSignWith />
          {variant === ENUM_AUTH_FORM_VARIANT.SIGNIN ? (
            <>
              <AuthForm
                onSuccess={handleOnSuccess}
                variant={ENUM_AUTH_FORM_VARIANT.SIGNIN}
                onForgetMenu={setForgotMenu}
                onChangeVariant={onChangeVariant}
              />
            </>
          ) : (
            <AuthForm
              onSuccess={handleOnSuccess}
              variant={ENUM_AUTH_FORM_VARIANT.REGISTER}
              onForgetMenu={setForgotMenu}
              onChangeVariant={onChangeVariant}
            />
          )}
        </FormsWrapper>
      )}
    </Root>
  );
};
