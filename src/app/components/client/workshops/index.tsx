'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ICategory, IWorkshop } from '@/src/types/DBTypes';
import { useEffect } from 'react';
import { Flexbox } from '../../commons/Flexbox';
import { Card } from '../home/Card';
import { Section } from '../commons/layout/Section';

import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { ButtonLink } from '../checkout/commons/ButtonLink';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import { Grid } from '../home/Grid';
import SectionHeader from '../home/SectionHeader';
import WrapperSection from '../commons/layout/WrapperSection';
import Categories from '../commons/Categories/Categories';
import { useCategories } from '../commons/Categories/useCategories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons';

interface Props {
  initialWorkshops: IWorkshop[];
  initialCategories: ICategory[];
}

export default function Workshops({
  initialWorkshops,
  initialCategories
}: Props) {
  const { onSelectCategory, onUpdateData, filteredData, selectedCategories } =
    useCategories(initialWorkshops);
  const t = useTranslations();
  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.WORKSHOPS,
      (data) => {
        onUpdateData(data);
      },
      (error) => {
        toast.error(error.message);
      },
      {
        published: true
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
      <SectionHeader
        backgroundImage='/images/home/workshop.webp'
        title='Exprimez votre créativité'
        description="Découvrez l’univers merveilleux de l'artisanat créatif avec RartCreation!"
      />
      <WrapperSection>
        <Section
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Categories
            categories={initialCategories}
            onSelectCategory={onSelectCategory}
            selectedCategories={selectedCategories}
          />
        </Section>
        <Section>
          <Grid>
            {filteredData.map((workshop, imageIndex) => (
              <Card
                textColor='var(--secondary-color)'
                boxShadow='rgba(106, 8, 120, 0.1)'
                key={imageIndex}
                src={(workshop as IWorkshop).image?.url}
                title={workshop.name}
                price={(workshop as any).price}
                description={workshop.description!}
                id={workshop._id!}
                hrefRoot='workshops'>
                <Flexbox justifyContent='center'>
                  <ButtonLink
                    backgroundColor='var(--secondary-color)'
                    href={`${ENUM_ROUTES.WORKSHOPS}/${workshop._id!}`}>
                    {t('Workshop.detail')}
                    <FontAwesomeIcon
                      style={{
                        marginLeft: '10px',
                        color: 'var(--secondary-color)'
                      }}
                      icon={faArrowRight as any}
                    />
                  </ButtonLink>
                </Flexbox>
              </Card>
            ))}
          </Grid>
        </Section>
      </WrapperSection>
    </Page>
  );
}
