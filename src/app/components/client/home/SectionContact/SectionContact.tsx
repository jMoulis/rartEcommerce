'use client';
import { Section } from '../../commons/layout/Section';
import styled from '@emotion/styled';
import { ContactForm } from './ContactForm';

const CustomSection = styled(Section)`
  justify-content: space-between;
  background: linear-gradient(
    180deg,
    rgba(106, 8, 120, 1) 8%,
    rgba(167, 109, 175, 0.6) 113%
  );
  justify-content: space-around;
  padding-top: 10px;
`;

export default function SectionContact() {
  return (
    <CustomSection>
      <ContactForm />
    </CustomSection>
  );
}
