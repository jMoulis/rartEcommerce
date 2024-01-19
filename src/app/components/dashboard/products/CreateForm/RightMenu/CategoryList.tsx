import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ICategory } from '@/src/types/DBTypes';
import { IconButton } from '@/src/app/components/commons/Buttons/IconButton';
import { faEdit, faUpload } from '@fortawesome/pro-light-svg-icons';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { FullDialog } from '@/src/app/components/commons/dialog/FullDialog';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { useTranslations } from 'next-intl';
import { CategoryForm } from './CategoryForm';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const ListItem = styled.li`
  display: flex;
  flex: 1;
  align-items: center;
`;

const CategoryItem = styled.button`
  padding: 5px 10px;
  flex: 1;
  border-radius: 5px;
  &:hover {
    background-color: var(--green-blue-color);
  }
`;
const Color = styled.div<{ backgroundColor?: string }>`
  height: 20px;
  width: 20px;
  border-radius: 30px;
  background-color: ${({ backgroundColor }) => backgroundColor ?? '#fff'};
  border: 1px solid rgba(0, 0, 0, 0.07);
  margin-right: 5px;
`;
interface Props {
  categories: ICategory[];
  onSelectCategory: (categroy: ICategory) => void;
}

export const CategoryList = ({ categories, onSelectCategory }: Props) => {
  const { open, onClose, onOpen } = useToggle();
  const t = useTranslations('Category');

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const handleEditCategory = (category: ICategory) => {
    setSelectedCategory(category);
    onOpen();
  };
  return (
    <Root>
      {categories.map((category, key) => (
        <ListItem key={key}>
          <Flexbox flex='1' justify-content='space-between' alignItems='center'>
            <CategoryItem>
              <Color backgroundColor={category.color} />
              {category.name}
            </CategoryItem>
            <IconButton
              variant='xs'
              icon={faEdit}
              backgroundColor='var(--cancel-color)'
              onClick={() => handleEditCategory(category)}
            />
            <IconButton
              variant='xs'
              icon={faUpload}
              backgroundColor='var(--primary-color)'
              onClick={() => onSelectCategory(category)}
            />
          </Flexbox>
        </ListItem>
      ))}
      <FullDialog
        open={open}
        onClose={onClose}
        styling={{
          content: {
            height: '20vh',
            minHeight: '20vh',
          },
        }}
        header={{
          title: t('editCategory'),
        }}>
        <CategoryForm editedCategory={selectedCategory} onClose={onClose} />
      </FullDialog>
    </Root>
  );
};
