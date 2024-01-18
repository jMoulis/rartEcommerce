'use client';

import emotionStyled from '@emotion/styled';
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
import { useFirestorProfile } from '../../../contexts/auth/hooks/useFirestoreProfile';
import AvatarInputFile from './AvatarInputFile';
import { ENUM_ROLES } from '@/src/app/contexts/auth/enums';
import { Button } from '../../commons/confirmation/Buttons/Button';

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
    firstname: '',
    lastname: '',
    roles: [ENUM_ROLES.VISITOR],
  });
  const profile = useAuthSelector((state) => state.profile);

  const t = useTranslations('ProfileForm');
  const tCommons = useTranslations('commons');

  const authDispatch = useAuthDispatch();

  const { onUpdateUserAvatar } = useAuth();
  const { onUpdateProfile } = useFirestorProfile();

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

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onUpdateProfile(form);
  };
  return (
    <main>
      <ChangeEmailForm
        email={form.email}
        onChangeEmailValue={handleChangeEmailValue}
      />

      <Form onSubmit={handleUpdateProfile}>
        <AvatarInputFile profile={form} onChange={handleInputFileChange} />
        <InputGroup
          id='firstname'
          name='firstname'
          label={t('firstname')}
          onInputChange={handleInputChange}
          value={form.firstname}
        />
        <InputGroup
          id='lastname'
          name='lastname'
          label={t('lastname')}
          onInputChange={handleInputChange}
          value={form.lastname}
        />

        <Button type='submit'>{tCommons('edit')}</Button>
      </Form>
      <AddressForm prevAddresses={form.addresses} />
    </main>
  );
};
