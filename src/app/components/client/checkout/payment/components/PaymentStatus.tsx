import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { Button } from '@/src/app/components/commons/Buttons/Button';

const Root = styled.div`
  padding: 20px 0;
  display: flex;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: calc(infinity);
  & * {
    color: var(--primary-color);
  }
`;

const AlertMessage = styled.span`
  display: block;
  font-size: 13px;
  max-width: 50%;
  text-align: center;
`;

const Container = styled.div`
  padding: 40px 0;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  border-radius: 10px;
  flex: 1;
  margin: 30px;
  height: 250px;
`;

interface Props {
  errorMessage?: string;
  paymentStatus: string;
  onRetry: () => void;
  onCancel: () => void;
  open: boolean;
}

const PaymentStatus = ({
  errorMessage,
  paymentStatus,
  onRetry,
  onCancel,
  open,
}: Props) => {
  const t = useTranslations();

  useEffect(() => {
    const root = document.body;
    if (open) {
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = 'auto';
    }
  }, [open]);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
        return (
          <Flexbox flexDirection='column'>
            <h2>{t('Cart.processing')}</h2>
            <FontAwesomeIcon
              style={{
                marginTop: '30px',
              }}
              icon={faSpinner}
              spin
            />
          </Flexbox>
        );

      case 'requires_action':
        return <h2>{t('Cart.authenticating')}</h2>;

      case 'succeeded':
        return <h2>{t('Cart.paymentSuccess')}</h2>;

      case 'error':
        return (
          <Flexbox
            flexDirection='column'
            alignItems='center'
            justifyContent='space-around'>
            <Flexbox flexDirection='column' alignItems='center'>
              <h2
                style={{
                  marginBottom: '10px',
                }}>
                {t('Cart.paymentError')}
              </h2>
              <p
                style={{
                  textAlign: 'center',
                }}>
                {errorMessage}
              </p>
            </Flexbox>
            <Button
              style={{
                color: '#fff',
              }}
              onClick={onRetry}>
              {t('Cart.retryPayment')}
            </Button>

            <Flexbox
              flexDirection='column'
              justifyContent='center'
              alignItems='center'>
              <Button
                style={{
                  color: '#fff',
                  backgroundColor: 'var(--secondary-color)',
                }}
                onClick={onCancel}>
                {t('Cart.cancelOrder')}
              </Button>
              <AlertMessage>{t('Cart.cancelOrderMessage')}</AlertMessage>
            </Flexbox>
          </Flexbox>
        );

      default:
        return null;
    }
  };
  if (!open) return null;
  return (
    <Root>
      <Container>{renderStatus(paymentStatus)}</Container>
    </Root>
  );
};

export default PaymentStatus;
