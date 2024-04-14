import styled from '@emotion/styled';
import { NavigationLink } from '../NavigationLink';

interface CallToActionProps {
  backgroundColor?: string;
  color?: string;
  hoverBackgroundColor?: string;
  hoverColor?: string;
  styling?: any;
}
export const CallToAction = styled(NavigationLink)<CallToActionProps>`
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) =>
    backgroundColor ?? 'rgba(255, 255, 255, 0.7)'};
  border-radius: var(--default-button-radius);
  padding: 15px 30px;
  margin: 0 20px;
  &:hover {
    text-decoration: none;
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor};
    color: ${({ hoverColor }) => hoverColor ?? '#fff'};
  }
  @media (max-width: 768px) {
    flex: 1;
    margin: 0 5px;
    margin-top: 10px;
    justify-content: center;
  }
  ${({ styling }) => styling};
`;
