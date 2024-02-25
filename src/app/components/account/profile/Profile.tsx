'use client';

import styled from '@emotion/styled';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { UserProfile } from '@/src/types/DBTypes';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useAuthDispatch } from '../../../contexts/auth/hooks/useAuthDispatch';
import { onUpdateProfileAction } from '../../../contexts/auth/actions';
import { useAuthSelector } from '../../../contexts/auth/hooks/useAuthSelector';
import { ChangeEmailForm } from './ChangeEmailForm';
import { useTranslations } from 'next-intl';
import { InputGroup } from '../../commons/form/InputGroup';
import { AddressForm } from './Address/AddressForm';
import { useFirestoreProfile } from '../../../contexts/auth/hooks/useFirestoreProfile';
import AvatarInputFile from './AvatarInputFile';
import { ENUM_ROLES } from '@/src/app/contexts/auth/enums';
import { Button } from '../../commons/Buttons/Button';
import { toast } from 'react-toastify';

const Root = styled.main`
  border: 1px solid var(--card-header-border-color);
  border-radius: 5px;
  margin: 20px;
`;
const Content = styled.div`
  margin: 20px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid var(--card-header-border-color);
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Profile = () => {
  const [form, setForm] = useState<UserProfile>({
    _id: '',
    email: '',
    avatar: '',
    addresses: [],
    firstname: '',
    lastname: '',
    roles: [ENUM_ROLES.VISITOR],
    verified: false,
  });
  const profile = useAuthSelector((state) => state.profile);

  const tProfileForm = useTranslations('ProfileForm');
  const t = useTranslations();
  const tCommons = useTranslations('commons');

  const authDispatch = useAuthDispatch();

  const { onUpdateUserAvatar } = useAuth();
  const { onUpdateProfile } = useFirestoreProfile();

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.currentTarget;
    const file = files?.[0];

    if (!file) return;

    try {
      const payload = await onUpdateUserAvatar(file);
      if (payload.data) {
        authDispatch(onUpdateProfileAction(payload.data));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleChangeEmailValue = (value: string) => {
    setForm((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onUpdateProfile(form);
  };

  if (!profile) return null;

  return (
    <>
      <Root>
        <Header>
          <h1>{t('Navbar.personalInfo')}</h1>
        </Header>
        <Content>
          <ChangeEmailForm
            email={form.email}
            onChangeEmailValue={handleChangeEmailValue}
          />
          <Form onSubmit={handleUpdateProfile}>
            <AvatarInputFile profile={form} onChange={handleInputFileChange} />
            <InputGroup
              id='firstname'
              name='firstname'
              label={tProfileForm('firstname')}
              onInputChange={handleInputChange}
              value={form.firstname}
            />
            <InputGroup
              id='lastname'
              name='lastname'
              label={tProfileForm('lastname')}
              onInputChange={handleInputChange}
              value={form.lastname}
            />
            <Button type='submit'>{tCommons('edit')}</Button>
          </Form>
        </Content>
      </Root>
      <AddressForm prevAddresses={form.addresses || []} />
    </>
  );
};
