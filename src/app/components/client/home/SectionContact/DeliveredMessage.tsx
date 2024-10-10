import React from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';

const Root = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding-top: 30px;
  position: relative;
  width: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 100%;
  transition: all 150ms ease;
  @media (max-width: 768px) {
    width: 100%;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;
interface Props {
  onClick: () => void;
}

export const DeliveredMessage = ({ onClick }: Props) => {
  const t = useTranslations();
  return <Root onClick={onClick}>{t('Contact.success')}</Root>;
};
