import { ICategory } from '@/src/types/DBTypes';
import React from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';

const List = styled.ul`
  display: flex;
  align-items: center;
  margin: 5px 0;
  height: 15px;
  flex: 1;
  justify-content: center;
`;
const ListItem = styled.li`
  margin-right: 10px;
`;
const Category = styled.button<{ selected: boolean }>`
  margin-right: 10px;
  text-decoration: ${({ selected }) => (selected ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
  }
`;

// const SelectedCategory = styled.button<{ backgroundColor?: string }>`
//   font-size: 13px;
//   background-color: ${({ backgroundColor }) => backgroundColor ?? 'white'};
//   border-radius: 3px;
//   padding: 3px 5px;
// `;
// const Filter = styled.button`
//   font-size: 13px;
// `;

interface Props {
  categories: ICategory[];
  onSelectCategory: (category: string) => void;
  selectedCategories: string[];
}

const Categories = ({
  categories = [],
  onSelectCategory,
  selectedCategories,
}: Props) => {
  const t = useTranslations();

  // const getCategoryName = (category: string) => {
  //   const selectedCategory = categories.find(
  //     (prevCategory) => prevCategory._id === category
  //   );
  //   return selectedCategory?.name;
  // };
  // const getCategoryColor = (category: string) => {
  //   const selectedCategory = categories.find(
  //     (prevCategory) => prevCategory._id === category
  //   );
  //   return selectedCategory?.color;
  // };
  return (
    <List>
      <ListItem>
        <Category
          selected={selectedCategories.includes('ALL')}
          onClick={() => onSelectCategory('ALL')}>
          {t('commons.all')}
        </Category>
      </ListItem>
      {categories.map((category) => (
        <ListItem key={category._id}>
          <Category
            selected={selectedCategories.includes(category._id!)}
            onClick={() => onSelectCategory(category._id!)}>
            {category.name}
          </Category>
        </ListItem>
      ))}
    </List>
  );
};
export default Categories;

/* <List>
        <ListItem>
          <Filter>{t('commons.filters')}</Filter>
        </ListItem>
        {selectedCategories.length > 0 &&
          selectedCategories.map((category) => {
            return (
              <ListItem key={category}>
                <SelectedCategory
                  backgroundColor={getCategoryColor(category)}
                  onClick={() => onSelectCategory(category)}>
                  {getCategoryName(category)}
                  <FontAwesomeIcon
                    icon={faXmark}
                    style={{ marginLeft: '5px' }}
                  />
                </SelectedCategory>
              </ListItem>
            );
          })}
      </List> */
