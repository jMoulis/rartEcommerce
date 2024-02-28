'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IWorkshop } from '@/src/types/DBTypes';
import { useEffect, useState } from 'react';
import { Flexbox } from '../../commons/Flexbox';
import { Card } from '../home/Card';
import { Section } from '../commons/layout/Section';
import { SectionHeader } from '../../commons/Layouts/SectionHeader';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { ButtonLink } from '../checkout/processing/commons/ButtonLink';
import { ENUM_ROUTES } from '../../navbar/routes.enums';

interface Props {
  initialWorkshops: IWorkshop[];
}

export default function Workshops({ initialWorkshops }: Props) {
  const [workshops, setWorkshops] = useState<IWorkshop[]>(initialWorkshops);
  const t = useTranslations();
  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.WORKSHOPS,
      (data) => {
        setWorkshops(data);
      },
      (error) => {
        toast.error(error.message);
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
              hrefRoot='workshops'>
              <Flexbox justifyContent='center'>
                <ButtonLink href={`${ENUM_ROUTES.WORKSHOPS}/${workshop._id!}`}>
                  {t('Workshop.detail')}
                </ButtonLink>
              </Flexbox>
            </Card>
          ))}
        </Flexbox>
      </Section>
    </Page>
  );
}
