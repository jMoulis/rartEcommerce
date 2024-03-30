'use client';

import { Flexbox } from '../../commons/Flexbox';
import { Section } from '../commons/layout/Section';
import styled from '@emotion/styled';

const Text = styled.p`
  color: #fb3e87;
  margin: 20px 0;
  font-size: 20px;
  line-height: 27px;
  @media (max-width: 768px) {
    margin: 0;
    font-size: 16px;
    line-height: 20px;
  }
`;

export default function SectionTestimonial() {
  return (
    <>
      <Section
        style={{
          backgroundColor: '#FFE5EF',
          display: 'flex',
          flexWrap: 'wrap',
        }}>
        <Text>
          I had a wonderful experience at rart creation. The staff was
          knowledgeable and friendly, and the selection of art supplies was
          impressive. I found everything I needed for my painting project. Thank
          you for providing such a great place for artists!
        </Text>
        <Flexbox justifyContent='flex-end'>
          <Text
            style={{
              marginTop: '10px',
              textAlign: 'right',
            }}>
            - Sophie
          </Text>
        </Flexbox>
      </Section>
    </>
  );
}
