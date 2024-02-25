import { AuthPage } from '@/src/app/components/auth/AuthPage';
import { ENUM_AUTH_FORM_VARIANT } from '@/src/app/components/auth/enums';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { useError } from '@/src/app/components/hooks/useError';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { ApiPayload } from '@/src/app/contexts/shared/types';
import { Dialog } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

const AlreadyClientLink = () => {
  const { open, onOpen, onClose } = useToggle();
  const t = useTranslations();
  const { onSetError, ErrorComponent } = useError();

  const handleSuccess = (payload: ApiPayload) => {
    if (!payload.status) {
      onSetError(payload.error);
    }
    if (payload?.data) {
      onClose();
      onSetError(null);
    }
  };

  return (
    <Flexbox alignItems='center'>
      <span
        style={{
          fontSize: '13px',
        }}>
        {t('Authform.alreadyHaveAnAccount')}
      </span>
      <Button
        type='button'
        style={{
          backgroundColor: 'transparent',
          borderRadius: '8px',
          color: 'var(--header-font-color)',
          padding: 0,
          fontSize: '13px',
        }}
        onClick={onOpen}>
        {t('authCommons.signIn')}
      </Button>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={onClose}
        keepMounted={false}>
        <AuthPage
          variant={ENUM_AUTH_FORM_VARIANT.SIGNIN}
          onSuccess={handleSuccess}
        />
        {ErrorComponent}
      </Dialog>
    </Flexbox>
  );
};

export default AlreadyClientLink;
