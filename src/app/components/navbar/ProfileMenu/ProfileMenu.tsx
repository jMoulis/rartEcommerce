'use client';

import React, { useEffect, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';

const ButtonProfileMenu = styled.button`
  margin-left: 10px;
`;

export const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [authFormVariant, setAuthFormVariant] =
    useState<ENUM_AUTH_FORM_VARIANT>(ENUM_AUTH_FORM_VARIANT.SIGNIN);
  const authProfile = useAuthSelector((state) => state.profile) as UserProfile;
  const prevRoute = useSearchParams().get('from');
  const action = useSearchParams().get('action');
  const router = useRouter();

  const { open, onOpen, onClose: onCloseAuthDialog } = useToggle();

  useEffect(() => {
    if (action === 'register') {
      setAuthFormVariant(ENUM_AUTH_FORM_VARIANT.REGISTER);
      onOpen();
    }
  }, [action]);

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

  const handleSuccess = () => {
    router.push(prevRoute ?? '/');
    onCloseAuthDialog();
  };

  const handleCloseAll = () => {
    router.push(prevRoute ?? '/');
  };
  return (
    <>
      {authProfile ? (
        <>
          <ButtonProfileMenu onClick={handleOpenMenu} type='button'>
            {authProfile?.avatar ? (
              <Image
                width={35}
                height={35}
                alt='user'
                style={{
                  borderRadius: '100%',
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
          onSuccess={handleSuccess}
          onChangeVariant={setAuthFormVariant}
          onCloseAll={handleCloseAll}
        />
      </Dialog>
    </>
  );
};
