import React, { useEffect, useState } from 'react';
import { Article } from '../Article';
import { useTranslations } from 'next-intl';
import styled from '@emotion/styled';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { Dialog } from '@mui/material';
import { DialogHeader } from '@/src/app/components/commons/dialog/DialogHeader';
import { DialogContent } from '@/src/app/components/commons/dialog/DialogContent';
import { CategoryForm } from './CategoryForm';
import { ICategory } from '@/src/types/DBTypes';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { CategoryList } from './CategoryList';
import { SmallButton } from '@/src/app/components/commons/Buttons/SmallButton';
import { Flexbox } from '@/src/app/components/commons/Flexbox';

const Root = styled.aside`
  width: 300px;
`;

interface Props {
  onSelectCategory: (category: ICategory) => void;
}

export const Menu = ({ onSelectCategory }: Props) => {
  const t = useTranslations();
  const { open, onClose, onOpen } = useToggle();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { onFindAllRealtime } = useFirestore();

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.CATEGORIES,
      (data) => {
        setCategories(data);
      },
      (error) => console.log(error)
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <Root>
      <Article headerTitle={t('Dashboard.categories')}>
        <Flexbox flexDirection='column' flex='1'>
          <SmallButton type='button' onClick={onOpen}>
            {t('commons.add')}
          </SmallButton>
          <CategoryList
            categories={categories}
            onSelectCategory={onSelectCategory}
          />
        </Flexbox>
      </Article>
      <Dialog open={open} onClose={onClose}>
        <DialogHeader
          title={t('commons.createWith', {
            type: `${t('commons.ae')} ${t('ProductForm.category')}`,
          })}
          onClose={onClose}
        />
        <DialogContent height='20vh'>
          <CategoryForm onClose={onClose} />
        </DialogContent>
      </Dialog>
    </Root>
  );
};
