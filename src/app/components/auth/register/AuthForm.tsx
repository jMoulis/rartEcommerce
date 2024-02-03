'use client';

import styled from '@emotion/styled';
import React, { FormEvent, useState } from 'react';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { ENUM_AUTH_FORM_VARIANT } from '../enums';
import { useTranslations } from 'next-intl';
import { UserCredential } from 'firebase/auth';
import { ApiPayload } from '@/src/app/contexts/shared/types';
import { Button } from '../../commons/Buttons/Button';
import { InputGroup } from '../../commons/form/InputGroup';
import { Flexbox } from '../../commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const LabelWithForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Props {
  onSuccess?: (credentials?: UserCredential) => void;
  variant: ENUM_AUTH_FORM_VARIANT;
  onForgetMenu: (state: boolean) => void;
  onChangeVariant: React.Dispatch<React.SetStateAction<ENUM_AUTH_FORM_VARIANT>>;
}

export const AuthForm = ({
  onSuccess,
  variant,
  onForgetMenu,
  onChangeVariant,
}: Props) => {
  const router = useRouter();
  const { onRegister, signInWithEmailPassword } = useAuth();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const prevRoute = useSearchParams().get('from');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email: string | undefined = (event.target as any).email?.value;
    const password: string | undefined = (event.target as any).password?.value;

    if (!email || !password) return undefined;

    try {
      setLoading(true);
      let payload: ApiPayload = {
        error: null,
        status: false,
        code: '',
        message: null,
      };
      if (variant === ENUM_AUTH_FORM_VARIANT.REGISTER) {
        payload = await onRegister({ email, password });
      } else if (variant === ENUM_AUTH_FORM_VARIANT.SIGNIN) {
        payload = await signInWithEmailPassword({
          email,
          password,
        });
      }
      if (payload.status) {
        onSuccess?.(payload.data);
        setErrorMessage(null);
        router.push(prevRoute ?? '/');
      } else if (payload.error) {
        throw Error(payload.error);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(error.message as string);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errorMessage ? <span>{errorMessage}</span> : null}
      <InputGroup
        required
        id={`email-${variant}`}
        name='email'
        type='email'
        label={t('Authform.email')}
      />
      <InputGroup
        type='password'
        id='password'
        name='password'
        label={t('Authform.password')}
        required
        CustomLabel={
          variant === ENUM_AUTH_FORM_VARIANT.SIGNIN ? (
            <LabelWithForgot>
              <span className='input-label'>{t('Authform.password')}</span>
              <Button
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--default-font-color)',
                  padding: '0',
                  marginBottom: '5px',
                  textDecoration: 'underline',
                }}
                type='button'
                onClick={() => onForgetMenu(true)}>
                {t('Authform.forgotPassword')}
              </Button>
            </LabelWithForgot>
          ) : undefined
        }
      />
      <Button
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 30px',
          width: 'unset',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '10px',
          paddingBottom: '10px',
          borderRadius: '100px',
          fontWeight: '600',
          fontSize: '17px',
          color: '#fff !important',
        }}
        disabled={loading}
        type='submit'>
        {t(`authCommons.${variant}`)}
        {loading ? (
          <FontAwesomeIcon
            style={{
              color: '#fff !important',
            }}
            icon={faSpinner}
            className='fa-pulse'
          />
        ) : (
          <span />
        )}
      </Button>
      {variant === ENUM_AUTH_FORM_VARIANT.SIGNIN ? (
        <Flexbox
          alignItems='center'
          justifyContent='center'
          style={{
            margin: '20px 0',
          }}>
          <span
            style={{
              display: 'flex',
              backgroundColor: 'transparent',
              color: 'var(--default-font-color)',
              padding: '0',
            }}>
            {t('Authform.dontHaveAnAccount')}
          </span>

          <Button
            style={{
              backgroundColor: 'transparent',
              color: 'var(--default-font-color)',
              padding: '0',
              textDecoration: 'underline',
            }}
            onClick={() => onChangeVariant(ENUM_AUTH_FORM_VARIANT.REGISTER)}
            type='button'>
            {t('authCommons.register')}
          </Button>
        </Flexbox>
      ) : null}
    </Form>
  );
};
