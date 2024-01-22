'use client';

import styled from '@emotion/styled';
import { Page } from './Page';

export const DashboardPageLayout = styled(Page)`
  height: calc(100vh - 50px);
  overflow: hidden;
  background-color: var(--background-section-color);
  display: grid;
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
