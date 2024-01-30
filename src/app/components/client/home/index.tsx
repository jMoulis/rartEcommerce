'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import SectionHeader from './SectionHeader';
import SectionAbout from './SectionAbout';
import SectionServices from './SectionServices';
import SectionProducts from './SectionProducts';
import SectionContact from './SectionContact/SectionContact';
import SectionTestimonial from './SectionTestimonial';
import { IProductService } from '@/src/types/DBTypes';

interface Props {
  initialProducts: IProductService[];
}
export default function Home({ initialProducts }: Props) {
  return (
    <Page
      style={{
        paddingTop: 0,
      }}>
      <SectionHeader />
      <SectionProducts products={initialProducts} />
      <SectionServices />
      <SectionTestimonial />
      <SectionAbout />
      <SectionContact />
    </Page>
  );
}
