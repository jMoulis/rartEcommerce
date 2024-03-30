/* eslint-disable n/handle-callback-err */
'use client';
import { Section } from '../commons/layout/Section';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import { Card } from './Card';
import styled from '@emotion/styled';
import { IWorkshop, IProductImage } from '@/src/types/DBTypes';
import { useCallback, useEffect, useState } from 'react';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import { ButtonLink } from '../checkout/processing/commons/ButtonLink';
import { Grid } from './Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons';

const CustomSection = styled(Section)`
  background-color: #fff4f8;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: unset;
  align-items: center;
`;
interface Props {
  initWorkshops: IWorkshop[];
}
export default function SectionWorkshops({ initWorkshops }: Props) {
  const t = useTranslations();
  const [workshops, setWorkshops] = useState<IWorkshop[]>(initWorkshops);

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.WORKSHOPS,
      (data) => {
        setWorkshops(data);
      },
      (error) => {
        toast.error(error.message);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const imageProduct = useCallback((booking: IWorkshop) => {
    const defaultImage: IProductImage | undefined = booking.image;
    return defaultImage?.url;
  }, []);

  return (
    <>
      <CustomSection>
        <Subtitle
          style={{
            color: 'var(--secondary-color)',
          }}>
          {t('Home.workshops')}
        </Subtitle>
        <Grid>
          {workshops.map((workshop, imageIndex) => (
            <Card
              textColor='var(--secondary-color)'
              boxShadow='rgba(106, 8, 120, 0.1)'
              src={imageProduct(workshop)}
              key={imageIndex}
              title={workshop.name}
              description={workshop.description ?? ''}
              price={workshop.price}
              id={workshop._id!}
              hrefRoot='workshops'>
              <ButtonLink
                href={`${ENUM_ROUTES.WORKSHOPS}/${workshop._id}`}
                backgroundColor='var(--secondary-color)'
                hoverBackgroundColor='var(--secondary-accent)'>
                {t('commons.detailedInformation')}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ marginLeft: '10px' }}
                />
              </ButtonLink>
            </Card>
          ))}
        </Grid>
      </CustomSection>
    </>
  );
}
