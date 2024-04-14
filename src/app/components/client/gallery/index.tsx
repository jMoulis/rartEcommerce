'use client';

import { useTranslations } from 'next-intl';
import { Page } from '../commons/layout/Page';
import SectionHeader from '../home/SectionHeader';
import { IArtwork, ICategory } from '@/src/types/DBTypes';
import Gallery from './Gallery';
import { Section } from '../commons/layout/Section';
import Categories from '../commons/Categories/Categories';
import { useCategories } from '../commons/Categories/useCategories';

interface Props {
  initialArtworks: IArtwork[];
  initialCategories: ICategory[];
}
const GalleryPage = ({ initialArtworks, initialCategories }: Props) => {
  const t = useTranslations();
  const { onSelectCategory, filteredData, selectedCategories } =
    useCategories(initialArtworks);

  return (
    <Page>
      <SectionHeader
        title={t('Navbar.gallery')}
        backgroundImage='/images/home/image1.jpeg'
        description="Découvrez l’univers merveilleux de l'artisanat créatif avec RartCreation!"
      />
      <Section>
        <Categories
          categories={initialCategories}
          onSelectCategory={onSelectCategory}
          selectedCategories={selectedCategories}
        />
      </Section>
      <Section
        style={{
          justifyContent: 'unset',
          flex: 1,
        }}>
        <Gallery artworks={filteredData as any} />
      </Section>
    </Page>
  );
};

export default GalleryPage;
