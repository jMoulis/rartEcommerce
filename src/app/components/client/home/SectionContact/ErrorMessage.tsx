import React from 'react';
import styled from '@emotion/styled';

const Root = styled.div`
  position: absolute;
  display: flex;
  top: -40px;
  left: 10px;
  right: 10px;
  background-color: rgb(189, 21, 21);
  padding: 10px 20px;
  border-radius: 5px;
  height: 40px;
  overflow: hidden;
`;
const Message = styled.p`
  color: #fff;
  overflow: hidden;
  line-height: 20px;
`;

interface Props {
  message: string | null;
}

export const ErrorMessage = ({ message }: Props) => {
  return (
    <Root>
      <Message>{message ?? 'TEST'}</Message>
    </Root>
  );
};
