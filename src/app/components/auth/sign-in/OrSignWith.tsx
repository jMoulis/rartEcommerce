import React from 'react';
import { Flexbox } from '../../commons/Flexbox';
import { useTranslations } from 'next-intl';

export const OrSignWith = () => {
  const t = useTranslations();
  return (
    <Flexbox
      justifyContent='center'
      alignItems='center'
      style={{
        position: 'relative',
        marginBottom: '10px',
      }}>
      <Flexbox
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
        }}>
        <div
          style={{
            height: '1px',
            background: 'rgba(0,0,0,0.5)',
            flex: 1,
            transform: 'translateY(2px)',
          }}
        />
      </Flexbox>
      <span
        style={{
          zIndex: 1,
          display: 'inline-block',
          backgroundColor: '#fff',
          padding: '10px 10px',
          color: 'var(--button-ellipsis-color)',
          fontSize: '14px',
        }}>
        {t('Authform.orSignWithEmail')}
      </span>
    </Flexbox>
  );
};
