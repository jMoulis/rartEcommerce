'use client';

import emotionStyled from '@emotion/styled';
import { ChangeEvent, useEffect, useState } from 'react';
import { IAddress, UserProfile } from '@/src/types/DBTypes';
import { useAuth } from '../../contexts/auth/hooks/useAuth';
import { useAuthDispatch } from '../../contexts/auth/hooks/useAuthDispatch';
import { onUpdateProfileAction } from '../../contexts/auth/actions';
import { useAuthSelector } from '../../contexts/auth/hooks/useAuthSelector';
import { ChangeEmailForm } from './ChangeEmailForm';
import { useTranslations } from 'next-intl';
import { InputGroup } from '../commons/form/InputGroup';
import { InputFile } from '../commons/form/InputFile';
import { AddressForm } from './Address/AddressForm';

const Form = emotionStyled.form`
  display: flex;
  flex-direction: column;
`;

export const Profile = () => {
  const [form, setForm] = useState<UserProfile>({
    _id: '',
    email: '',
    avatar: '',
    addresses: [],
  });
  const profile = useAuthSelector((state) => state.profile);
  const t = useTranslations('ProfileForm');

  const authDispatch = useAuthDispatch();

  const { onUpdateUserAvatar } = useAuth();

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
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeEmailValue = (value: string) => {
    setForm((prev) => ({
      ...prev,
      email: value,
    }));
  };
  const handleAddAddress = (addresses: IAddress[]) => {
    setForm((prev) => ({
      ...prev,
      addresses,
    }));
  };
  return (
    <>
      <ChangeEmailForm
        email={form.email}
        onChangeEmailValue={handleChangeEmailValue}
      />

      <Form>
        <InputGroup
          id='firstname'
          name='firstname'
          label={t('firstname')}
          onInputChange={handleInputChange}
        />
        <InputGroup
          id='lastname'
          name='lastname'
          label={t('lastname')}
          onInputChange={handleInputChange}
        />
        <InputFile
          id='avatar'
          name='avatar'
          label={t('avatar')}
          onInputChange={handleInputFileChange}
        />
        <AddressForm
          onAddAddress={handleAddAddress}
          prevAddresses={form.addresses}
        />
      </Form>
    </>
  );
};
