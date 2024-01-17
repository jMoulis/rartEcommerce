import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  disabled: boolean;
  saving?: boolean;
  onClick: () => void;
}
export const SubmitButton = ({ disabled, saving, onClick }: Props) => {
  const t = useTranslations();
  return (
    <button
      className='button button-save'
      type='button'
      onClick={onClick}
      aria-disabled={disabled || saving}
      disabled={disabled || saving}>
      {saving ? (
        <FontAwesomeIcon icon={faSpinner} className='fa-pulse' />
      ) : (
        <>{t('commons.save')}</>
      )}
    </button>
  );
};
