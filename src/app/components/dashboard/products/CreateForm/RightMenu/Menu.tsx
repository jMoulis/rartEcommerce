import React, { useEffect, useState } from 'react';
import { Article } from '../Article';
import { useTranslations } from 'next-intl';
import styled from '@emotion/styled';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Button } from '../../../../commons/confirmation/Buttons/Button';
import { useToggle } from '../../../../hooks/useToggle';
import { Dialog } from '@mui/material';
import { DialogHeader } from '../../../../commons/dialog/DialogHeader';
import { DialogContent } from '../../../../commons/dialog/DialogContent';
import { InputGroup } from '../../../../commons/form/InputGroup';
import { CategoryForm } from './CategoryForm';
import { DialogFooter } from '@/src/app/components/commons/dialog/DialogFooter';
import { ICategory } from '@/src/types/DBTypes';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';

const Root = styled.aside`
  width: 300px;
`;

interface Props {}

export const Menu = (props: Props) => {
  const t = useTranslations();
  const { open, onClose, onOpen } = useToggle();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { onFindAllRealtime } = useFirestore();

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.CATEGORIES,
      (data) => {
        console.log(data);
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
  console.log(categories);
  return (
    <Root>
      <Article headerTitle={t('Dashboard.categories')}>
        <Button type='button' onClick={onOpen}>
          {t('commons.add')}
        </Button>
        <ul>
          {categories.map((category, key) => (
            <li key={key}>{category.name}</li>
          ))}
        </ul>
      </Article>
      <Dialog open={open} onClose={onClose}>
        <DialogHeader
          title={t('commons.createWith', {
            type: `${t('commons.ae')} ${t('ProductForm.category')}`,
          })}
          onClose={onClose}
        />
        <DialogContent height='20vh'>
          <CategoryForm />
        </DialogContent>
      </Dialog>
    </Root>
  );
};
