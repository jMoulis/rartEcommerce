'use client';
import { Section } from '../commons/layout/Section';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import { Card } from './Card';
import { products } from './products';
export default function SectionProducts() {
  const t = useTranslations();
  return (
    <>
      <Section
        style={{
          minHeight: '500px',
          flexWrap: 'wrap',
        }}>
        <Subtitle
          style={{
            color: 'var(--default-font-color)',
          }}>
          {t('Home.about')}
        </Subtitle>
        <Flexbox flexWrap='wrap'>
          {products.map((service, imageIndex) => (
            <Card
              textColor='var(--default-font-color)'
              key={imageIndex}
              root='/images/products/product'
              imageIndex={imageIndex}
              title={service.title}
            />
          ))}
        </Flexbox>
      </Section>
    </>
  );
}
