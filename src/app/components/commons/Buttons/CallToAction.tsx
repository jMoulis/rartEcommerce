import styled from '@emotion/styled';
import { NavigationLink } from '../NavigationLink';

interface CallToActionProps {
  backgroundColor: string;
  hoverBackgroundColor?: string;
}
export const CallToAction = styled(NavigationLink)<CallToActionProps>`
  color: ${({ backgroundColor }) => backgroundColor};
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: var(--default-button-radius);
  padding: 15px 30px;
  margin: 0 20px;
  &:hover {
    text-decoration: none;
    background-color: ${({ backgroundColor }) => backgroundColor};
    color: #fff;
  }
  @media (max-width: 768px) {
    flex: 1;
    margin: 0;
    margin-top: 10px;
    justify-content: center;
  }
`;
