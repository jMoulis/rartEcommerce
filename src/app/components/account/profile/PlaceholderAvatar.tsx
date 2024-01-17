'use client';

import emotionStyled from '@emotion/styled';
import React, { useMemo } from 'react';

const Root = emotionStyled.span`
  text-transform: uppercase;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  height: 35px;
  width: 35px;
  border-radius: 50px;
  background-color: rgba(0,0,0,0.05);
`;

interface Props {
  firstname?: string;
  lastname?: string;
}

const PlaceholderAvatar = ({ firstname, lastname }: Props) => {
  const placeholderValue = useMemo(() => {
    const capital1 = firstname?.[0];
    const capital2 = lastname?.[0];
    return `${capital1 ?? ''}${capital2 ?? ''}`;
  }, []);
  return <Root>{placeholderValue}</Root>;
};

export default PlaceholderAvatar;
