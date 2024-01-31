'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IBooking } from '@/src/types/DBTypes';
import { useEffect, useState } from 'react';
import { Flexbox } from '../../commons/Flexbox';
import { Card } from '../home/Card';

interface Props {
  initialBookings: IBooking[];
}

export default function Bookings({ initialBookings }: Props) {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const { onFindAllRealtime } = useFirestore();

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.BOOKINGS,
      (data) => {
        setBookings(data);
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      },
      {
        published: true,
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <Page>
      <Flexbox flexWrap='wrap'>
        {bookings.map((service, imageIndex) => (
          <Card
            textColor='var(--default-font-color)'
            key={imageIndex}
            src={service.image?.url}
            title={service.name}
            price={service.price}
            description={service.description!}
            id={service._id!}
            hrefRoot='services'
          />
        ))}
      </Flexbox>
    </Page>
  );
}
