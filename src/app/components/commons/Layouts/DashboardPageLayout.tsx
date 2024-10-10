'use client';

import styled from '@emotion/styled';

export const DashboardPageLayout = styled.main`
  height: 100vh;
  overflow: hidden;
  background-color: var(--primary-color);
  display: grid;
  padding-top: 80px;
  grid-template-columns: auto 1fr; /* Adjust the width of the menu */
  grid-template-rows: auto 1fr; /* Auto for breadcrumb, 1fr for content */
  grid-template-areas:
    'menu breadcrumb'
    'menu content';
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* One column layout */
    grid-template-rows: auto auto 1fr; /* Rows for breadcrumb, menu, and content */
    grid-template-areas:
      'breadcrumb'
      'content'
      'menu';
  }
`;
