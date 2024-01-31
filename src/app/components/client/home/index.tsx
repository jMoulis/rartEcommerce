'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import SectionHeader from './SectionHeader';
import SectionAbout from './SectionAbout';
import SectionServices from './SectionServices';
import SectionProducts from './SectionProducts';
import SectionContact from './SectionContact/SectionContact';
import SectionTestimonial from './SectionTestimonial';
import { IBooking, IProductService } from '@/src/types/DBTypes';

interface Props {
  initialProducts: IProductService[];
  initialBookings: IBooking[];
}
export default function Home({ initialProducts, initialBookings }: Props) {
  return (
    <Page
      style={{
        paddingTop: 0,
      }}>
      <SectionHeader />
      <SectionProducts initialProducts={initialProducts} />
      <SectionServices initialBookings={initialBookings} />
      <SectionTestimonial />
      <SectionAbout />
      <SectionContact />
    </Page>
  );
}
