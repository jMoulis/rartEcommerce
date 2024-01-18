'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth/hooks/useAuth';
import { Button } from '../commons/confirmation/Buttons/Button';

interface Props {
  onValidate?: () => void;
}
export const Confirmation = ({ onValidate }: Props) => {
  const router = useRouter();
  const { onSignOut } = useAuth();

  const t = useTranslations();

  const handleValidate = async () => {
    await onSignOut();
    router.replace('/');
    onValidate?.();
  };
  return (
    <div>
      <p>{t('Authform.messageSent')}</p>
      <Button type='button' onClick={handleValidate}>
        OK
      </Button>
    </div>
  );
};
