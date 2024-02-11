'use client';

import React from 'react';
import { GoogleSignIn } from './GoogleSignIn';
import './providers.css';
import { ApiPayload } from '@/src/app/contexts/shared/types';
import styled from '@emotion/styled';
import { useError } from '../../hooks/useError';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;
const ButtonListItem = styled.li`
  margin-bottom: 10px;
`;

interface ProviderType {
  id: string;
  button: (props: {
    onClick: (signInFunction: () => Promise<ApiPayload>) => void;
  }) => React.JSX.Element;
}
const providers: ProviderType[] = [
  {
    id: 'google',
    button: (props) => <GoogleSignIn {...props} />,
  },
];

interface Props {
  onSuccess: (payload: ApiPayload) => void;
}

export default function SignIn({ onSuccess }: Props) {
  const { onSetError, ErrorComponent } = useError();

  const handleSignIn = async (signInFunction: () => Promise<ApiPayload>) => {
    const payload = await signInFunction();
    if (!payload.status && payload.error) {
      onSetError(payload.error);
    }
    if (payload.status) {
      onSuccess(payload);
      onSetError(null);
    }
  };
  return (
    <Root>
      {providers.map((provider, key) => (
        <ButtonListItem key={key}>
          {provider.button({ onClick: handleSignIn })}
        </ButtonListItem>
      ))}
      {ErrorComponent}
    </Root>
  );
}
