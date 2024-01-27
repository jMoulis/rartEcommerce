'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import SectionHeader from './SectionHeader';
import SectionAbout from './SectionAbout';
import SectionServices from './SectionServices';
import SectionProducts from './SectionProducts';
import SectionContact from './SectionContact/SectionContact';
import SectionTestimonial from './SectionTestimonial';

export default function Home() {
  return (
    <Page>
      <SectionHeader />
      <SectionAbout />
      <SectionServices />
      <SectionProducts />
      <SectionTestimonial />
      <SectionContact />
    </Page>
  );
}
