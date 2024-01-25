'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import SectionHeader from './SectionHeader';
import SectionAbout from './SectionAbout';

export default function Home() {
  return (
    <Page>
      <SectionHeader />
      <SectionAbout />
    </Page>
  );
}
