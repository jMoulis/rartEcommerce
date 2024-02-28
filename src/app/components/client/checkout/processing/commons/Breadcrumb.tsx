'use client';

import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { ENUM_ROUTES } from '../../../../navbar/routes.enums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBasketShopping,
  faEuroSign,
  faTruck,
  faUser,
} from '@fortawesome/pro-light-svg-icons';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { isCartStepValid, isInformationStepValid } from '../cart/utils';
import { toast } from 'react-toastify';

const Root = styled.ul`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const ListItem = styled.li`
  margin: 0 10px;
`;

const ListItemSeparator = styled.li`
  flex: 1;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.5);
`;
const StepLinkItem = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  height: 25px;
  width: 25px;
  background-color: ${({ selected }) => (selected ? 'blue' : '')};
  & * {
    color: ${({ selected }) => (selected ? '#fff' : '')};
  }
`;

export const Breadcrumb = () => {
  const { cart } = useCart();
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
  return (
    <Root>
      <ListItem>
        <StepLinkItem
          onClick={() => handleSelectStep(ENUM_ROUTES.CHECKOUT_CART)}
          selected={false}>
          <FontAwesomeIcon icon={faBasketShopping} />
        </StepLinkItem>
      </ListItem>
      <ListItemSeparator />
      <ListItem>
        <StepLinkItem
          disabled={!isCartStepValid(cart)}
          onClick={() => handleSelectStep(ENUM_ROUTES.CHECKOUT_INFORMATIONS)}
          selected={pathname.includes(ENUM_ROUTES.CHECKOUT_INFORMATIONS)}>
          <FontAwesomeIcon icon={faUser} />
        </StepLinkItem>
      </ListItem>
      <ListItemSeparator />
      {shouldDisplayShipping ? (
        <>
          <ListItem>
            <StepLinkItem
              disabled={!isInformationStepValid(cart)}
              onClick={() => handleSelectStep(ENUM_ROUTES.CHECKOUT_DELIVERY)}
              selected={pathname.includes(ENUM_ROUTES.CHECKOUT_DELIVERY)}>
              <FontAwesomeIcon icon={faTruck} />
            </StepLinkItem>
          </ListItem>
          <ListItemSeparator />
        </>
      ) : null}
      <ListItem>
        <StepLinkItem
          disabled={!isInformationStepValid(cart)}
          onClick={() => handleSelectStep(ENUM_ROUTES.CHECKOUT_PAYMENT)}
          selected={pathname.includes(ENUM_ROUTES.CHECKOUT_PAYMENT)}>
          <FontAwesomeIcon icon={faEuroSign} />
        </StepLinkItem>
      </ListItem>
    </Root>
  );
};
