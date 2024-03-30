'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { Section } from '../commons/layout/Section';
import { ContactForm } from '../home/SectionContact/ContactForm';
import SectionHeader from '../home/SectionHeader';
import { useTranslations } from 'next-intl';

export default function Contact() {
  const t = useTranslations();

  return (
    <Page
      style={{
        paddingTop: 0,
      }}>
      <SectionHeader
        backgroundImage='/images/home/background.jpeg'
        title={t('Contact.title')}
        description="Découvrez l’univers merveilleux de l'artisanat créatif avec RartCreation!"
      />
      <Section
        style={{
          backgroundColor: '#cce5ff',
        }}>
        <ContactForm />
      </Section>
    </Page>
  );
}
