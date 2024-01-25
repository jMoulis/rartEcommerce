'use client';
import { Section } from '../commons/layout/Section';
import Image from 'next/image';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';

export default function SectionAbout() {
  const t = useTranslations();
  const keys = ['paragraph1', 'paragraph2'] as const;

  return (
    <>
      <Section
        style={{
          height: '500px',
          backgroundColor: 'var(--secondary-color)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          padding: '70px 50px',
        }}>
        <Flexbox
          flex='1'
          flexDirection='column'
          style={{
            marginRight: '50px',
          }}>
          <Subtitle>{t('Home.about')}</Subtitle>
          <ul>
            {keys.map((key) => (
              <li key={key}>
                <p
                  style={{
                    color: 'var(--white)',
                    margin: '20px 0',
                  }}>
                  {t(`Home.sectionAbout.${key}`)}
                </p>
              </li>
            ))}
          </ul>
        </Flexbox>
        <Flexbox
          flex='1'
          justifyContent='center'
          alignItems='center'
          style={{
            height: '100%',
            position: 'relative',
          }}>
          <Image
            alt='Rachel'
            src='/images/home/rachAbout.webp'
            fill
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
