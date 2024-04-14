import { IArtwork } from '@/src/types/DBTypes';
import Image from 'next/image';
import React, { useEffect } from 'react';
import styled from '@emotion/styled';

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  flex: 1;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;
const ImageContainer = styled.div`
  overflow: hidden;
  position: relative;
  height: 300px;
  cursor: pointer;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;
interface Props {
  artworks: IArtwork[];
}

const Gallery = ({ artworks }: Props) => {
  const [artworkDefaultImages, setArtworkDefaultImages] = React.useState<
    string[]
  >([]);

  useEffect(() => {
    const defaultImages = artworks.map((artwork) => {
      return artwork.images[0].url;
    });
    for (let i = defaultImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [defaultImages[i], defaultImages[j]] = [
        defaultImages[j],
        defaultImages[i],
      ]; // Swap elements
    }
    setArtworkDefaultImages(defaultImages);
  }, [artworks]);

  const calculateSpan = (index: number) => {
    // Simple example: Alternate span sizes
    return index % 3 === 0 ? 2 : 1;
  };

  return (
    <Root>
      {artworkDefaultImages.map((url, key) => (
        <ImageContainer
          key={key}
          style={{
            gridColumnEnd: `span ${calculateSpan(key)}`,
          }}>
          <Image
            src={url}
            alt={`Artwork ${key + 1}`}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </ImageContainer>
      ))}
    </Root>
  );
};
export default Gallery;
