'use client';

import styled from '@emotion/styled';
import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/pro-light-svg-icons';
import { useTranslations } from 'next-intl';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Securised() {
  const securised = useMemo(() => window.location.protocol === 'https', []);

  const t = useTranslations();
  return (
    <Root>
      <FontAwesomeIcon icon={faLock} />
      <span>{t('Cart.payment')}</span>
      <span
        style={{
          color: securised ? 'var(--success-color)' : 'var(--error-color)',
          textTransform: 'lowercase',
        }}>
        {t('Cart.securised')}
      </span>
    </Root>
  );
}
