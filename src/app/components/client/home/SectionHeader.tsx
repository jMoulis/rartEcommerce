'use client';

import { Section } from '../commons/layout/Section';
import { Title } from '../commons/typography/Title';
import Image from 'next/image';
import { Flexbox } from '../../commons/Flexbox';
import { NavigationLink } from '../../commons/NavigationLink';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import { useTranslations } from 'next-intl';
import styled from '@emotion/styled';

const BackgroundImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: contrast(0.5);
`;

const ContentWrapper = styled(Flexbox)`
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 30px;
`;

const CustomSection = styled(Section)`
  height: 500px;
  @media (max-width: 768px) {
    height: 350px;
  }
`;

export default function SectionHeader() {
  const t = useTranslations();
  return (
    <>
      <CustomSection>
        <BackgroundImageWrapper>
          <Image
            alt='Wonderful picture'
            src={'/images/home/background.webp'}
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </BackgroundImageWrapper>
        <ContentWrapper
          alignItems='center'
          flexDirection='column'
          justifyContent='center'>
          <Title
            style={{
              marginBottom: '20px',
            }}>
            Exprimez votre créativité
          </Title>
          <p
            style={{
              color: 'var(--white)',
              fontSize: '18px',
            }}>
            Découvrez l’univers merveilleux de l'artisanat créatif avec Rart
            Creation!
          </p>
          <Flexbox
            style={{
              margin: '30px',
            }}>
            <NavigationLink
              active={false}
              route={{
                label: t('Navbar.bookNow'),
                href: ENUM_ROUTES.SERVICES,
              }}
            />
            <NavigationLink
              active={false}
              route={{
                label: t('Navbar.buyNow'),
                href: ENUM_ROUTES.PRODUCTS,
              }}
            />
          </Flexbox>
        </ContentWrapper>
      </CustomSection>
    </>
  );
}
