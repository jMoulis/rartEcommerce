'use client';

import styled from '@emotion/styled';

export const Section = styled.section`
  position: relative;
  padding: 50px 50px;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 30px 20px;
  }
`;
