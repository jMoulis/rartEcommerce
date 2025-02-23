import React, { ChangeEvent } from 'react';

import { useTranslations } from 'next-intl';
import { InputGroup } from '../../commons/form/InputGroup';
import { TextareaGroup } from '../../commons/form/TextareaGroup';
import { Flexbox } from '../../commons/Flexbox';
import { Article } from '../products/CreateForm/Article';
import { IArtwork } from '@/src/types/DBTypes';

interface Props {
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  form: IArtwork;
}

export const ArtworkDetailForm = ({ form, onInputChange }: Props) => {
  const t = useTranslations();

  return (
    <Article
      headerTitle={t('Artwork.detail')}
      styling={{
        root: {
          flex: '1',
          marginRight: '10px'
        }
      }}>
      <Flexbox flexDirection='column' flex='1'>
        <InputGroup
          name='name'
          id='name'
          value={form.name}
          onChange={onInputChange}
          label={t('Artwork.name')}
        />
        <TextareaGroup
          name='description'
          id='description'
          value={form.description}
          onInputChange={onInputChange}
          label={t('Artwork.description')}
        />
      </Flexbox>
    </Article>
  );
};
