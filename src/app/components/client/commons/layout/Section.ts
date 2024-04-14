'use client';

import styled from '@emotion/styled';

export const Section = styled.section`
  label: Section;
  position: relative;
  padding: 30px 30px;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 20px;
  }
`;
