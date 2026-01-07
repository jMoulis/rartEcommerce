'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IProductService } from '@/src/types/DBTypes';
import { useEffect } from 'react';
import { Section } from '../commons/layout/Section';
import { toast } from 'react-toastify';
import { ProductListItem } from './ProductListItem';
import { Grid } from '../home/Grid';
import SectionHeader from '../home/SectionHeader';
import WrapperSection from '../commons/layout/WrapperSection';
import { useCategories } from '../commons/Categories/useCategories';

interface Props {
  initialProducts: IProductService[];
}

export default function Products({ initialProducts }: Props) {
  const { onUpdateData, filteredData } = useCategories(initialProducts);

  useEffect(() => {
    onUpdateData(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.PRODUCTS,
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
        backgroundImage='/images/home/image1.jpeg'
        title='Embelissez votre vie'
        description="Découvrez l’univers merveilleux de l'artisanat créatif avec RartCreation!"
      />
      <WrapperSection>
        <Section
          style={{
            paddingTop: '50px'
          }}>
          <Grid>
            {filteredData.map((product, key) => (
              <ProductListItem key={key} product={product as IProductService} />
            ))}
          </Grid>
        </Section>
      </WrapperSection>
    </Page>
  );
}
