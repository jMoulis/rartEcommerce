import { useTranslations } from 'next-intl';
import React from 'react';
import { useFormStatus } from 'react-dom';

export const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <button type='submit' aria-disabled={pending}>
      {t('commons.save')}
    </button>
  );
};
