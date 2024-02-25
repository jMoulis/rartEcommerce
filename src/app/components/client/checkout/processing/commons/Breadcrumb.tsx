'use client';

import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { ENUM_ROUTES } from '../../../../navbar/routes.enums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBasketShopping,
  faEuroSign,
  faTruck,
  faUser,
} from '@fortawesome/pro-light-svg-icons';

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
const StepLinkItem = styled(Link)``;

export const Breadcrumb = () => {
  return (
    <Root>
      <ListItem>
        <StepLinkItem href={ENUM_ROUTES.CHECKOUT_CART}>
          <FontAwesomeIcon icon={faBasketShopping} />
        </StepLinkItem>
      </ListItem>
      <ListItemSeparator />
      <ListItem>
        <StepLinkItem href={ENUM_ROUTES.CHECKOUT_INFORMATIONS}>
          <FontAwesomeIcon icon={faUser} />
        </StepLinkItem>
      </ListItem>
      <ListItemSeparator />
      <ListItem>
        <StepLinkItem href={ENUM_ROUTES.CHECKOUT_DELIVERY}>
          <FontAwesomeIcon icon={faTruck} />
        </StepLinkItem>
      </ListItem>
      <ListItemSeparator />
      <ListItem>
        <StepLinkItem href={ENUM_ROUTES.CHECKOUT_PAYMENT}>
          <FontAwesomeIcon icon={faEuroSign} />
        </StepLinkItem>
      </ListItem>
    </Root>
  );
};
