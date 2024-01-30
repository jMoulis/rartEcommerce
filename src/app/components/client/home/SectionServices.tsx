'use client';
import { Section } from '../commons/layout/Section';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import { Card } from './Card';
import { services } from './services';
import styled from '@emotion/styled';

const CustomSection = styled(Section)`
  min-height: 500px;
  background: linear-gradient(var(--primary-color), rgb(255, 189, 255));
  flex-wrap: wrap;
`;
export default function SectionServices() {
  const t = useTranslations();
  return (
    <>
      <CustomSection>
        <Subtitle>{t('Home.services')}</Subtitle>
        <Flexbox flexWrap='wrap'>
          {services.map((service, imageIndex) => (
            <Card
              textColor='#fff'
              src='/images/services/service'
              key={imageIndex}
              title={service.title}
              description=''
              price={2}
              id='imageIndex'
            />
          ))}
        </Flexbox>
      </CustomSection>
    </>
  );
}
