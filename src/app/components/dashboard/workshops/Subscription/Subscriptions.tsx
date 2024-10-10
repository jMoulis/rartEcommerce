import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { IWorkshop, ISubscription } from '@/src/types/DBTypes';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { useTranslations } from 'next-intl';
import { SubscriptionTable } from './SubscriptionTable';
import { useToggle } from '../../../hooks/useToggle';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { SubscriptionItem } from './SubscriptionItem';
import { PriceSessionForm } from '../PriceSessionForm';

const Root = styled.div``;

interface Props {
  subscriptionId?: string;
  onSelectSubscription: (subscriptionId: string) => void;
  form: IWorkshop;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const Subscriptions = ({
  subscriptionId,
  onSelectSubscription,
  form,
  onInputChange,
}: Props) => {
  const { open, onClose, onOpen } = useToggle();
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const t = useTranslations();

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.SUBSCRIPTIONS,
      (data) => {
        setSubscriptions(data);
      },
      (_error) => {}
    );
    return () => {
      unsubscribe?.();
    };
  }, []);

  const selectedSubscription = useMemo(
    () => subscriptions.find((prev) => prev._id === subscriptionId),
    [subscriptionId, subscriptions]
  );

  const handleSelect = (subId: string) => {
    onSelectSubscription(subId);
    onClose();
  };

  return (
    <Root>
      <PriceSessionForm form={form} onInputChange={onInputChange} />
      <SubscriptionItem onOpen={onOpen} subscription={selectedSubscription} />
      <FullDialog
        open={open}
        onClose={onClose}
        dialog={{
          fullWidth: true,
          maxWidth: 'lg',
        }}
        styling={{
          content: {
            height: '20vh',
            minHeight: '20vh',
          },
        }}
        header={{
          title: t('Booking.subscriptions'),
        }}>
        {open ? (
          <SubscriptionTable
            subscriptions={subscriptions}
            onSubscriptionChange={handleSelect}
            workshop={form}
          />
        ) : null}
      </FullDialog>
    </Root>
  );
};
