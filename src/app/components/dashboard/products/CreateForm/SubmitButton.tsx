import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '../../../commons/Buttons/Button';

interface Props {
  disabled?: boolean;
  saving?: boolean;
  onClick: () => void;
}
export const SubmitButton = ({ disabled, saving, onClick }: Props) => {
  const t = useTranslations();
  return (
    <Button
      style={{
        backgroundColor: 'var(--success-color)'
      }}
      type='button'
      onClick={onClick}
      aria-disabled={disabled ?? saving}
      disabled={disabled ?? saving}>
      {saving ? (
        <FontAwesomeIcon icon={faSpinner as any} className='fa-pulse' />
      ) : (
        <>{t('commons.save')}</>
      )}
    </Button>
  );
};
