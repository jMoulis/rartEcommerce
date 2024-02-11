'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IWorkshop } from '@/src/types/DBTypes';
import { useEffect, useState } from 'react';
import { Flexbox } from '../../commons/Flexbox';
import { Card } from '../home/Card';
import { Section } from '../commons/layout/Section';
import { SectionHeader } from '../../commons/Layouts/SectionHeader';

interface Props {
  initialWorkshops: IWorkshop[];
}

export default function Workshops({ initialWorkshops }: Props) {
  const [workshops, setWorkshops] = useState<IWorkshop[]>(initialWorkshops);
  const { onFindAllRealtime } = useFirestore();

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.WORKSHOPS,
      (data) => {
        setWorkshops(data);
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
      <SectionHeader />
      <Section>
        <Flexbox flexWrap='wrap'>
          {workshops.map((workshop, imageIndex) => (
            <Card
              textColor='var(--default-font-color)'
              key={imageIndex}
              src={workshop.image?.url}
              title={workshop.name}
              price={workshop.price}
              description={workshop.description!}
              id={workshop._id!}
              hrefRoot='workshops'
              item={workshop}
            />
          ))}
        </Flexbox>
      </Section>
    </Page>
  );
}
