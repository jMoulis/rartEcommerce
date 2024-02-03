'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GoogleSignIn } from './GoogleSignIn';
import './providers.css';
import { ApiPayload } from '@/src/app/contexts/shared/types';
import styled from '@emotion/styled';

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
  onSuccess?: () => void;
}

export default function SignIn({ onSuccess }: Props) {
  const router = useRouter();

  const handleSignIn = async (signInFunction: () => Promise<ApiPayload>) => {
    const payload = await signInFunction();
    onSuccess?.();
    if (payload.status) {
      router.refresh();
    }
  };
  return (
    <Root>
      {providers.map((provider, key) => (
        <ButtonListItem key={key}>
          {provider.button({ onClick: handleSignIn })}
        </ButtonListItem>
      ))}
    </Root>
  );
}
