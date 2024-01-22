'use client';

import styled from '@emotion/styled';

export const SectionPage = styled.section`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 20px;
  border-radius: 8px;
  grid-area: content;
  @media (max-width: 768px) {
    margin: 10px;
    margin-bottom: 50px;
  }
`;
