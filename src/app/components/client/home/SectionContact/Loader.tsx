import React from 'react';
import Lottie from 'react-lottie';
import animationData from './lottie.json';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';

const Root = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(106, 8, 120, 0.5);
`;
const LoaderText = styled.span`
  display: block;
  font-size: 20px;
  width: 60%;
  text-align: center;
  color: #fff;
`;
const LottieAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={150} width={150} />;
};

interface Props {
  sending: boolean;
}

export const Loader = ({ sending }: Props) => {
  const t = useTranslations();
  return (
    <Root
      style={{
        visibility: sending ? 'initial' : 'hidden',
      }}>
      <LottieAnimation />
      <LoaderText>{t('Contact.sendingMessage')}</LoaderText>
    </Root>
  );
};
