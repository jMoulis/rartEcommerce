'use client';

import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { ENUM_ROUTES } from '../../../navbar/routes.enums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBasketShopping,
  faEuroSign,
  faTruck,
  faUser
} from '@fortawesome/pro-light-svg-icons';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { isCartStepValid, isInformationStepValid } from '../cart/utils';
import { toast } from 'react-toastify';
import { Section } from '../../commons/layout/Section';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import NavigationBreadcrumb from '@/src/app/components/client/products/Breadcrumb';
import { useTranslations } from 'next-intl';

const CustomSection = styled(Section)`
  flex-direction: column;
  margin: 0 60px;
  @media (max-width: 768px) {
    margin: 0;
    padding: 5px;
  }
`;
const List = styled.ul`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const ListItem = styled.li`
  margin: 0 10px;
`;

const ListItemSeparator = styled.li<{ selected: boolean }>`
  flex: 1;
  height: 2px;
  background-color: ${({ selected }) =>
    selected ? 'var(--primary-color)' : 'rgb(199, 199, 199)'};
  position: relative;
  &::after {
    position: absolute;
    right: 0;
    top: -4px;
    content: '';
    display: block;
    height: 10px;
    background-color: ${({ selected }) =>
      selected ? 'var(--primary-color)' : 'rgb(199, 199, 199)'};
    width: 10px;
    border-radius: 10px;
  }
`;
const StepLinkItem = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  height: 30px;
  width: 30px;
  border: 1px solid var(--primary-color);
  background-color: ${({ selected }) =>
    selected ? 'var(--primary-color)' : ''};
  & * {
    color: ${({ selected }) => (selected ? '#fff' : 'var(--primary-color)')};
  }
  &:disabled {
    background-color: #f5f5f5;
    border-color: #f5f5f5;
    & * {
      color: #d8d8d8;
    }
  }
`;

export const Breadcrumb = () => {
  const { cart } = useCart();
  const t = useTranslations();

  const pathname = usePathname();
  const shouldDisplayShipping = useMemo(
    () => cart?.items?.some((item) => item.type === 'product'),
    [cart?.items]
  );
  const router = useRouter();

  const handleSelectStep = (step: ENUM_ROUTES) => {
    switch (step) {
      case ENUM_ROUTES.CHECKOUT_CART: {
        router.push(ENUM_ROUTES.CHECKOUT_CART);
        break;
      }
      case ENUM_ROUTES.CHECKOUT_INFORMATIONS: {
        if (isCartStepValid(cart)) {
          router.push(ENUM_ROUTES.CHECKOUT_INFORMATIONS);
        } else {
          toast.error('Complete the form');
        }
        break;
      }
      case ENUM_ROUTES.CHECKOUT_DELIVERY: {
        if (isCartStepValid(cart)) {
          router.push(ENUM_ROUTES.CHECKOUT_DELIVERY);
        } else {
          toast.error('Complete the form');
        }
        break;
      }
      case ENUM_ROUTES.CHECKOUT_PAYMENT: {
        if (isInformationStepValid(cart)) {
          router.push(ENUM_ROUTES.CHECKOUT_PAYMENT);
        } else {
          toast.error('Complete the form');
        }
        break;
      }

      default:
        break;
    }
  };

  const isRootSelected = useMemo(() => {
    const parseURIEnumRoot = ENUM_ROUTES.CHECKOUT.split('/').pop();
    const pathArray = pathname.split('/');
    const lastEntry = pathArray[pathArray.length - 1];
    return parseURIEnumRoot === lastEntry;
  }, [pathname]);

  if (!cart) return null;
  return (
    <CustomSection>
      <NavigationBreadcrumb text={t('Cart.basket')} />
      <Flexbox justifyContent='center' flex='1'>
        <List>
          <ListItem>
            <StepLinkItem
              onClick={() => handleSelectStep(ENUM_ROUTES.CHECKOUT)}
              selected={isRootSelected}>
              <FontAwesomeIcon icon={faBasketShopping as any} />
            </StepLinkItem>
          </ListItem>
          <ListItemSeparator selected={isCartStepValid(cart)} />
          <ListItem>
            <StepLinkItem
              disabled={!isCartStepValid(cart)}
              onClick={() =>
                handleSelectStep(ENUM_ROUTES.CHECKOUT_INFORMATIONS)
              }
              selected={pathname.includes(ENUM_ROUTES.CHECKOUT_INFORMATIONS)}>
              <FontAwesomeIcon icon={faUser as any} />
            </StepLinkItem>
          </ListItem>
          <ListItemSeparator selected={isInformationStepValid(cart)} />
          {shouldDisplayShipping ? (
            <>
              <ListItem>
                <StepLinkItem
                  disabled={!isInformationStepValid(cart)}
                  onClick={() =>
                    handleSelectStep(ENUM_ROUTES.CHECKOUT_DELIVERY)
                  }
                  selected={pathname.includes(ENUM_ROUTES.CHECKOUT_DELIVERY)}>
                  <FontAwesomeIcon icon={faTruck as any} />
                </StepLinkItem>
              </ListItem>
              <ListItemSeparator
                selected={pathname.includes(ENUM_ROUTES.CHECKOUT_PAYMENT)}
              />
            </>
          ) : null}
          <ListItem>
            <StepLinkItem
              disabled={!isInformationStepValid(cart)}
              onClick={() => handleSelectStep(ENUM_ROUTES.CHECKOUT_PAYMENT)}
              selected={pathname.includes(ENUM_ROUTES.CHECKOUT_PAYMENT)}>
              <FontAwesomeIcon icon={faEuroSign as any} />
            </StepLinkItem>
          </ListItem>
        </List>
      </Flexbox>
    </CustomSection>
  );
};
