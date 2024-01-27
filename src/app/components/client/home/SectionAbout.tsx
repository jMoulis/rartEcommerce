'use client';
import { Section } from '../commons/layout/Section';
import Image from 'next/image';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import styled from '@emotion/styled';

const TextWrapper = styled(Flexbox)`
  margin-right: 50px;
  min-width: 500px;
  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const Text = styled.p`
  color: var(--white);
  margin: 20px 0;
  font-size: 16px;
  line-height: 24px;
  text-align: justify;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export default function SectionAbout() {
  const t = useTranslations();
  const keys = ['paragraph1', 'paragraph2'] as const;

  return (
    <>
      <Section
        style={{
          backgroundColor: 'var(--secondary-color)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
        <TextWrapper flex='1' flexDirection='column'>
          <Subtitle>{t('Home.about')}</Subtitle>
          <ul>
            {keys.map((key) => (
              <li key={key}>
                <Text>{t(`Home.sectionAbout.${key}`)}</Text>
              </li>
            ))}
          </ul>
        </TextWrapper>
        <Flexbox
          flex='1'
          justifyContent='center'
          alignItems='center'
          style={{
            position: 'relative',
            width: '100%',
          }}>
          <Image
            alt='Rachel'
            src='/images/home/rachAbout.webp'
            width='400'
            height='300'
            style={{
              borderRadius: '15px',
              objectFit: 'cover',
              objectPosition: 'center center',
            }}
          />
        </Flexbox>
      </Section>
    </>
  );
}
