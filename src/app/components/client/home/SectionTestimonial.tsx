'use client';

import { useEffect, useRef, useState } from 'react';
import { Flexbox } from '../../commons/Flexbox';
import { Section } from '../commons/layout/Section';
import styled from '@emotion/styled';
import madre from '@/src/app/style/fonts/madre/madre';
import { findAllOnce } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';

const CustomSection = styled(Section)`
  /* background-color: #ffe5ef; */
  display: flex;
  min-height: 400px;
  flex-direction: column;
  @media (max-width: 768px) {
    min-height: fit-content;
  }
`;

const TestimonialWrapper = styled(Flexbox)`
  max-width: 100vw;
  overflow: auto;
  overflow-y: hidden;
  margin-top: 20px;
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgb(251, 62, 135, 0.2);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--secondary-color); /* Darker grey for the handle */
    border-radius: 10px; /* Rounded corners for the handle */
  }
  /* This styles the scrollbar itself (width, etc.) */
  ::-webkit-scrollbar {
    border-radius: 10px;
    height: 5px; /* Height of the horizontal scrollbar */
  }
`;

const Testimonial = styled(Flexbox)`
  background-color: rgba(255, 229, 239, 0.3);
  width: 300px;
  min-width: 300px;
  margin: 10px;
  padding: 20px;
  height: fit-content;
  border-radius: 10px;
  @media (max-width: 768px) {
    width: 300px;
  }
`;

const Text = styled.p`
  color: var(--secondary-color);
  font-size: 20px;
  line-height: 27px;
  @media (max-width: 768px) {
    margin: 0;
    font-size: 16px;
    line-height: 20px;
  }
`;

export default function SectionTestimonial() {
  const [testimonials, setTestimonials] = useState<
    Array<{ author: string; text: string }>
  >([]);
  const [loading, setLoading] = useState<'UNSET' | 'LOADING' | 'DONE'>('UNSET');
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for forward, -1 for backward
  const scrollRef = useRef<HTMLDivElement>(null); // Add this line to create a ref
  const t = useTranslations();

  useEffect(() => {
    try {
      setLoading('LOADING');
      findAllOnce(ENUM_COLLECTIONS.TESTIMONIALS)
        .then((payload) => {
          setTestimonials(payload.data);
          setLoading('DONE');
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      setLoading('DONE');
    }
  }, []);

  useEffect(() => {
    // Auto-scroll effect
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const atEnd = scrollLeft >= scrollWidth - clientWidth;
        const atStart = scrollLeft <= 0;
        const testimonialWidth = 300; // Width of a single testimonial
        const viewableTestimonials = Math.floor(clientWidth / testimonialWidth);
        const scrollAmount = viewableTestimonials * testimonialWidth;

        if (atEnd) {
          setScrollDirection(-1); // Reverse direction to backward
        } else if (atStart) {
          setScrollDirection(1); // Reverse direction to forward
        }

        scrollRef.current.scrollBy({
          left: scrollAmount * scrollDirection,
          behavior: 'smooth',
        });
      }
    }, 10000); // Adjust time as needed

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, [scrollDirection]);

  return (
    <CustomSection>
      <Subtitle
        style={{
          color: 'var(--secondary-color)',
          textAlign: 'center',
        }}>
        {t('Home.testimonials')}
      </Subtitle>
      {loading === 'LOADING' ? <span>Chargement...</span> : null}
      <TestimonialWrapper ref={scrollRef}>
        {testimonials.map((testimonial, index) => (
          <Testimonial key={index} flexDirection='column'>
            <Text className={madre.className}>{`"${testimonial.text}"`}</Text>
            <Flexbox justifyContent='flex-end'>
              <Text
                className={madre.className}
                style={{
                  marginTop: '10px',
                  textAlign: 'right',
                }}>
                - {testimonial.author}
              </Text>
            </Flexbox>
          </Testimonial>
        ))}
      </TestimonialWrapper>
    </CustomSection>
  );
}
