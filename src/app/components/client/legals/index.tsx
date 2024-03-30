'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { Section } from '../commons/layout/Section';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import styled from '@emotion/styled';
import { Title } from '../commons/typography/Title';
import Image from 'next/image';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';

const MailToLink = () => (
  <a
    style={{ textDecoration: 'underline', marginLeft: '5px' }}
    href='mailto:contact@rartcreation.fr'>
    contact@rartcreation.fr.
  </a>
);
const PhoneToLink = () => (
  <a href='tel:+33 06 16 22 49 28'>+33 06 16 22 49 28.</a>
);
const Card = styled.div`
  width: 300px;
`;
const CustomSubsection = styled(Section)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;
const SectionTitle = styled.h2`
  font-size: var(--h2-font-size);
  margin-top: 20px;
  margin-bottom: 5px;
`;

const TitleWrapper = styled(Flexbox)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(23.75px);
  width: 749px;
  align-items: center;
  flex-direction: column;
  padding: 30px;
  border-radius: 5px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: unset;
    margin-bottom: 30px;
  }
`;

const BackgroundImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
export default function Legals() {
  const t = useTranslations();

  return (
    <Page>
      <Section
        style={{
          paddingTop: '100px',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
        <BackgroundImageWrapper>
          <Image
            alt='bigbang'
            src={'/images/home/background.jpeg'}
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </BackgroundImageWrapper>
        <Flexbox
          style={{
            zIndex: 10,
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Title>Mentions Légales</Title>
          <TitleWrapper>
            <Subtitle>Bienvenue sur RartCreation</Subtitle>
            <p>
              Le site officiel de Rachel Moulis, artiste et créateur des œuvres
              et ateliers disponibles à la vente sur ce site.
            </p>
          </TitleWrapper>
        </Flexbox>
      </Section>
      <CustomSubsection>
        <Card>
          <SectionTitle>Informations légales</SectionTitle>
          <h3
            style={{
              marginTop: '10px',
              marginBottom: '5px',
            }}>
            Éditeur du site :
          </h3>
          <ul>
            <li>Nom de l'entreprise ou de l'artiste : RartCreation</li>
            <li>Adresse : 2521 route de bonneville, 74800 Arenthon</li>
            <li>
              Téléphone : <PhoneToLink />
            </li>
            <li>
              E-mail : <MailToLink />
            </li>
            <li>SIRET : [Votre numéro SIRET]</li>
            <li>Responsable de publication : Rachel Moulis</li>
          </ul>
          <h3
            style={{
              marginTop: '10px',
              marginBottom: '5px',
            }}>
            Hébergement :
          </h3>
          <ul>
            <li>Nom de l’hébergeur : Vercel Inc. </li>
            <li>Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789 USA</li>
            <li>Téléphone : (559) 288-7060</li>
          </ul>
          <SectionTitle>Contact</SectionTitle>
          <p>
            Pour toute question ou demande d’information concernant le site, ou
            toute déclaration relative à ce site, vous pouvez nous contacter à :
            <MailToLink />
          </p>
        </Card>

        <Card>
          <SectionTitle>Propriété intellectuelle</SectionTitle>
          <p>
            Toutes les œuvres présentes sur le site, incluant sans limitation
            toutes les créations artistiques et les ateliers, sont protégées par
            le droit d’auteur et sont la propriété exclusive de Rachel Moulis.
          </p>
          <p>
            Toute reproduction, distribution, ou autre exploitation sans
            l’autorisation expresse de Rachel Moulis est strictement interdite
            et susceptible de poursuites judiciaires.
          </p>
        </Card>
        <Card>
          <SectionTitle>Collecte de données personnelles</SectionTitle>
          <p>
            Les informations recueillies sur ce site sont enregistrées dans un
            fichier informatisé par Rachel Moulis pour la gestion des commandes,
            des clients et des prospects, ainsi que pour l’envoi occasionnel
            d’offres promotionnelles.
          </p>
          <p>
            Conformément à la loi « informatique et libertés », vous pouvez
            exercer votre droit d'accès aux données vous concernant et les faire
            rectifier en contactant :
            <MailToLink />
          </p>
          <SectionTitle>Cookies</SectionTitle>
          <p>
            Notre site utilise des cookies pour améliorer l’expérience
            utilisateur et analyser le trafic. En naviguant sur notre site, vous
            acceptez l’utilisation des cookies conformément à notre politique de
            confidentialité.
          </p>
          <SectionTitle>Modification des mentions légales</SectionTitle>
          <p>
            Rachel Moulis se réserve le droit de modifier les présentes mentions
            à tout moment. Les utilisateurs seront informés des modifications
            via notre site.
            <span
              style={{
                fontSize: '13px',
                marginTop: '10px',
                color: 'rgba(0, 0, 0, 0.7)',
              }}>
              {t('commons.lastUpdate', {
                date: format(new Date(), 'dd/MM/yyyy'),
              })}
            </span>
          </p>
        </Card>
      </CustomSubsection>
    </Page>
  );
}
