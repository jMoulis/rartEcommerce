'use client';

import { Section } from '../commons/layout/Section';
import styled from '@emotion/styled';

const Text = styled.p`
  color: var(--white);
  margin: 20px 0;
  font-size: 30px;
  line-height: 45px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export default function SectionTestimonial() {
  return (
    <>
      <Section
        style={{
          backgroundColor: 'var(--secondary-color)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
        <Text>
          I had a wonderful experience at rart creation. The staff was
          knowledgeable and friendly, and the selection of art supplies was
          impressive. I found everything I needed for my painting project. Thank
          you for providing such a great place for artists! - Sophie
        </Text>
      </Section>
    </>
  );
}
