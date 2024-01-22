import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ISubscription } from '@/src/types/DBTypes';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { useTranslations } from 'next-intl';
import { SubscriptionTable } from './SubscriptionTable';
import { useToggle } from '../../../hooks/useToggle';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { SubscriptionItem } from './SubscriptionItem';

const Root = styled.div``;

interface Props {
  subscriptionId?: string;
  onSelectSubscription: (subscriptionId: string) => void;
}

export const Subscriptions = ({
  subscriptionId,
  onSelectSubscription,
}: Props) => {
  const { open, onClose, onOpen } = useToggle();
  const { onFindAllRealtime } = useFirestore();
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
          />
        ) : null}
      </FullDialog>
    </Root>
  );
};
