import styled from '@emotion/styled';
import { NavigationLink } from '../NavigationLink';

export const CallToAction = styled(NavigationLink)<{
  backgroundColor: string;
  hoverBackgroundColor?: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: var(--default-button-radius);
  padding: 15px 30px;
  margin: 0 20px;
  &:hover {
    text-decoration: none;
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor};
  }
  @media (max-width: 768px) {
    flex: 1;
    margin: 0;
    margin-top: 10px;
    justify-content: center;
  }
`;
