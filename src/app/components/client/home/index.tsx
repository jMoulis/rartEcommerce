'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import SectionHeader from './SectionHeader';
import SectionAbout from './SectionAbout';
import SectionServices from './SectionWorkshops';
import SectionProducts from './SectionProducts';
import styled from '@emotion/styled';
import SectionTestimonial from './SectionTestimonial';
import { IWorkshop, IProductService } from '@/src/types/DBTypes';
import { Flexbox } from '../../commons/Flexbox';
import { CallToAction } from '../../commons/Buttons/CallToAction';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import { useTranslations } from 'next-intl';

const CallToActionWrapper = styled(Flexbox)`
  margin: 30px;
  flex-wrap: wrap;
  padding-top: 50px;
  @media (max-width: 768px) {
    padding: 0;
    margin: 0;
  }
`;

interface Props {
  initialProducts: IProductService[];
  initWorkshops: IWorkshop[];
}
export default function Home({ initialProducts, initWorkshops }: Props) {
  const t = useTranslations();
  return (
    <Page
      style={{
        paddingTop: 0,
      }}>
      <SectionHeader
        backgroundImage='/images/home/background.jpeg'
        title='Exprimez votre créativité'
        description="Découvrez l’univers merveilleux de l'artisanat créatif avec RartCreation!">
        <CallToActionWrapper>
          <CallToAction
            active={false}
            backgroundColor='var(--secondary-color)'
            hoverBackgroundColor='var(--secondary-accent)'
            route={{
              label: t('Navbar.bookNow'),
              href: ENUM_ROUTES.WORKSHOPS,
            }}
          />

          <CallToAction
            active={false}
            backgroundColor='var(--primary-color)'
            hoverBackgroundColor='var(--action-button-color)'
            route={{
              label: t('Navbar.buyNow'),
              href: ENUM_ROUTES.PRODUCTS,
            }}
          />
        </CallToActionWrapper>
      </SectionHeader>
      <SectionProducts initialProducts={initialProducts} />
      <SectionServices initWorkshops={initWorkshops} />
      <SectionAbout />
      {/* <SectionContact /> */}
      <SectionTestimonial />
    </Page>
  );
}
