/* eslint-disable n/handle-callback-err */
'use client';
import { Section } from '../commons/layout/Section';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import { Card } from './Card';
import styled from '@emotion/styled';
import { IBooking, IProductImage } from '@/src/types/DBTypes';
import { useCallback, useEffect, useState } from 'react';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';

const CustomSection = styled(Section)`
  min-height: 500px;
  background: linear-gradient(var(--primary-color), rgb(255, 189, 255));
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: unset;
`;
interface Props {
  initialBookings: IBooking[];
}
export default function SectionServices({ initialBookings }: Props) {
  const t = useTranslations();
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
        // console.log(error);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
  const imageProduct = useCallback((booking: IBooking) => {
    const defaultImage: IProductImage | undefined = booking.image;
    return defaultImage?.url;
  }, []);
  return (
    <>
      <CustomSection>
        <Subtitle>{t('Home.services')}</Subtitle>
        <Flexbox flexWrap='wrap'>
          {bookings.map((booking, imageIndex) => (
            <Card
              textColor='#fff'
              src={imageProduct(booking)}
              key={imageIndex}
              title={booking.name}
              description={booking.description ?? ''}
              price={booking.price}
              id='imageIndex'
              hrefRoot='services'
            />
          ))}
        </Flexbox>
      </CustomSection>
    </>
  );
}
