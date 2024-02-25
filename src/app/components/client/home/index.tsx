'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import SectionHeader from './SectionHeader';
import SectionAbout from './SectionAbout';
import SectionServices from './SectionWorkshops';
import SectionProducts from './SectionProducts';
import SectionContact from './SectionContact/SectionContact';
import SectionTestimonial from './SectionTestimonial';
import { IWorkshop, IProductService } from '@/src/types/DBTypes';

interface Props {
  initialProducts: IProductService[];
  initWorkshops: IWorkshop[];
}
export default function Home({ initialProducts, initWorkshops }: Props) {
  return (
    <Page
      style={{
        paddingTop: 0,
      }}>
      <SectionHeader />
      <SectionProducts initialProducts={initialProducts} />
      <SectionServices initWorkshops={initWorkshops} />
      <SectionTestimonial />
      <SectionAbout />
      <SectionContact />
    </Page>
  );
}
