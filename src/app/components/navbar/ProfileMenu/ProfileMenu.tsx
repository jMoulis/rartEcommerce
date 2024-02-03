'use client';

import React, { useState } from 'react';
import { Dialog, Menu } from '@mui/material';
import styled from '@emotion/styled';
import { AuthMenu } from './AuthMenu';
import { LinksMenu } from './LinksMenu';
import { useToggle } from '../../hooks/useToggle';
import { ENUM_AUTH_FORM_VARIANT } from '../../auth/enums';
import Image from 'next/image';
import { AuthPage } from '../../auth/AuthPage';
import { useAuthSelector } from '@/src/app/contexts/auth/hooks/useAuthSelector';
import { UserProfile } from '@/src/types/DBTypes';
import PlaceholderAvatar from '../../account/profile/PlaceholderAvatar';

const ButtonProfileMenu = styled.button`
  margin-left: 10px;
`;

export const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [authFormVariant, setAuthFormVariant] =
    useState<ENUM_AUTH_FORM_VARIANT>(ENUM_AUTH_FORM_VARIANT.SIGNIN);
  const authProfile = useAuthSelector((state) => state.profile) as UserProfile;

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
    <>
      {authProfile ? (
        <>
          <ButtonProfileMenu onClick={handleOpenMenu} type='button'>
            {authProfile?.avatar ? (
              <Image
                width={40}
                height={40}
                alt='user'
                style={{
                  borderRadius: '5px',
                  margin: '0 10px',
                }}
                src={authProfile?.avatar}
                priority
              />
            ) : (
              <PlaceholderAvatar
                firstname={authProfile.firstname}
                lastname={authProfile.lastname}
              />
            )}
          </ButtonProfileMenu>
          <Menu
            open={Boolean(anchorEl)}
            transitionDuration={0}
            anchorEl={anchorEl}
            onClose={handleCloseMenu}>
            <li>
              <LinksMenu onClose={handleCloseMenu} />
            </li>
          </Menu>
        </>
      ) : (
        <AuthMenu onClick={handleSelect} />
      )}

      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={onCloseAuthDialog}
        keepMounted={false}>
        <AuthPage
          variant={authFormVariant}
          onSuccess={onCloseAuthDialog}
          onChangeVariant={setAuthFormVariant}
        />
      </Dialog>
    </>
  );
};
