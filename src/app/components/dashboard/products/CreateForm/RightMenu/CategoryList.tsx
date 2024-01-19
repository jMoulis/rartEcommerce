import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ICategory, ISection } from '@/src/types/DBTypes';
import { IconButton } from '@/src/app/components/commons/Buttons/IconButton';
import {
  faEdit,
  faTableLayout,
  faUpload,
} from '@fortawesome/pro-light-svg-icons';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { FullDialog } from '@/src/app/components/commons/dialog/FullDialog';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { useTranslations } from 'next-intl';
import { CategoryForm } from './CategoryForm';
import { TemplateAvailable } from './TemplateAvailable';

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
  previousSelectedCategories: string[];
  onSelectCategory: (category: string) => void;
  onSelectSections?: (sections: ISection[]) => void;
}

export const CategoryList = ({
  categories,
  onSelectCategory,
  onSelectSections,
  previousSelectedCategories,
}: Props) => {
  const { open, onClose, onOpen } = useToggle();
  const {
    open: openTemplate,
    onClose: onCloseTemplate,
    onOpen: onOpenTemplate,
  } = useToggle();

  const t = useTranslations('Category');

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const handleEditCategory = (category: ICategory) => {
    setSelectedCategory(category);
    onOpen();
  };

  const handleSelectCategory = (category: ICategory) => {
    onSelectCategory(category._id!);
    setSelectedCategory(null);
  };

  const handleSelectTemplateSections = (sections: ISection[]) => {
    onSelectSections?.(sections);
    onCloseTemplate();
    setSelectedCategory(null);
  };

  const handleOpenTemplateModal = (category: ICategory) => {
    setSelectedCategory(category);
    onOpenTemplate();
  };
  const hanldeTemplateModalClose = () => {
    onCloseTemplate();
    setSelectedCategory(null);
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
              onClick={() => handleSelectCategory(category)}
              disabled={previousSelectedCategories.includes(category._id!)}
            />
            {onSelectSections ? (
              <IconButton
                variant='xs'
                icon={faTableLayout}
                backgroundColor='var(--primary-color)'
                onClick={() => handleOpenTemplateModal(category)}
              />
            ) : null}
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
      <FullDialog
        open={openTemplate}
        onClose={hanldeTemplateModalClose}
        dialog={{
          fullWidth: true,
          maxWidth: 'md',
        }}
        styling={{
          content: {
            padding: '0',
            minHeight: '80vh',
            overflow: 'auto',
            backgroundColor: 'var(--background-section-color)',
          },
        }}
        header={{
          title: t('editCategory'),
        }}>
        {selectedCategory ? (
          <TemplateAvailable
            category={selectedCategory}
            onSelectTemplateSections={handleSelectTemplateSections}
          />
        ) : null}
      </FullDialog>
    </Root>
  );
};
