'use client';
import { Section } from '../commons/layout/Section';
import Image from 'next/image';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import styled from '@emotion/styled';
import { ButtonLink } from '../checkout/processing/commons/ButtonLink';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons';
import { CallToAction } from '../../commons/Buttons/CallToAction';

const CustomSection = styled(Section)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: #cce5ff;
`;

const Content = styled(Flexbox)`
  margin-right: 50px;
  margin-top: 30px;
  margin-bottom: 30px;
  min-width: 500px;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    flex-direction: column-reverse;
    margin-right: 0;
  }
`;
const ImageWrapper = styled.div`
  position: relative;
  width: 400px;
  height: 290px;
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
  }
`;
const TextWrapper = styled.ul`
  margin: 0 50px;
  height: 300px;
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 24px;
  max-width: 400px;
  text-align: justify;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export default function SectionAbout() {
  const t = useTranslations();
  const keys = ['paragraph1', 'paragraph2'] as const;

  return (
    <>
      <CustomSection>
        <Subtitle
          style={{
            color: 'var(--primary-color)',
          }}>
          {t('Home.about')}
        </Subtitle>
        <Content flex='1'>
          <TextWrapper>
            {keys.map((key) => (
              <li key={key}>
                <Text>{t(`Home.sectionAbout.${key}`)}</Text>
              </li>
            ))}
          </TextWrapper>
          <ImageWrapper>
            <Image
              alt='Rachel'
              src='/images/home/rach.png'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              style={{
                borderRadius: '5px',
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
            />
          </ImageWrapper>
        </Content>
        <CallToAction
          active={false}
          backgroundColor='var(--primary-color)'
          hoverBackgroundColor='var(--primary-accent)'
          icon={faEnvelope}
          route={{
            label: t('Contact.title'),
            href: ENUM_ROUTES.CONTACT,
          }}
        />
        {/* <CallToAction
          style={{
            padding: '10px 20px',
          }}
          href={ENUM_ROUTES.CONTACT}>
          <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px' }} />
          {t('Contact.title')}
        </CallToAction> */}
      </CustomSection>
    </>
  );
}
