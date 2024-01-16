import React, { ChangeEvent } from 'react';
import { InputFile } from '../../commons/form/InputFile';
import { useTranslations } from 'next-intl';
import { UserProfile } from '@/src/types/DBTypes';
import PlaceholderAvatar from './PlaceholderAvatar';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  profile: UserProfile;
}

const AvatarInputFile = ({ onChange, profile }: Props) => {
  const t = useTranslations('ProfileForm');
  return (
    <InputFile
      id='avatar'
      name='avatar'
      label={t('avatar')}
      onInputChange={onChange}
      placeholder={
        <PlaceholderAvatar
          firstname={profile.firstname}
          lastname={profile.lastname}
        />
      }
      value={profile.avatar}
    />
  );
};

export default AvatarInputFile;
