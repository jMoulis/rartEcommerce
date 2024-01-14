'use client';

import React, { useState } from 'react';
import { Dialog, Menu } from '@mui/material';
import emotionStyled from '@emotion/styled';
import { AuthMenu } from './AuthMenu';
import { LinksMenu } from './LinksMenu';
import { useToggle } from '../../hooks/useToggle';
import { ENUM_AUTH_FORM_VARIANT } from '../../auth/enums';
import Image from 'next/image';
import { AuthPage } from '../../auth/AuthPage';
import { useAuthSelector } from '@/src/app/contexts/auth/hooks/useAuthSelector';
import { UserProfile } from '@/src/types/DBTypes';

const ButtonProfileMenu = emotionStyled.button``;

export const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [authFormVariant, setAuthFormVariant] =
    useState<ENUM_AUTH_FORM_VARIANT>(ENUM_AUTH_FORM_VARIANT.SIGNIN);

  const profile = useAuthSelector((state) => state.profile) as UserProfile;

  const { open, onOpen, onClose: onCloseAuthDialog } = useToggle();

  const handleSelect = async (variant: ENUM_AUTH_FORM_VARIANT) => {
    onOpen();
    setAuthFormVariant(variant);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <ButtonProfileMenu onClick={handleOpenMenu} type='button'>
        <Image
          width={30}
          height={30}
          alt='user'
          src={profile?.avatar ?? '/images/default-avatar.png'}
          priority
        />
      </ButtonProfileMenu>

      <Menu
        open={Boolean(anchorEl)}
        transitionDuration={0}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}>
        <li>
          {profile ? (
            <LinksMenu onClose={handleCloseMenu} />
          ) : (
            <AuthMenu onClick={handleSelect} />
          )}
        </li>
      </Menu>
      <Dialog open={open} onClose={onCloseAuthDialog} keepMounted={false}>
        <AuthPage variant={authFormVariant} onSuccess={onCloseAuthDialog} />
      </Dialog>
    </div>
  );
};
