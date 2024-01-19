import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ICategory } from '@/src/types/DBTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/pro-light-svg-icons';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';

const CategoriesTags = styled.ul`
  display: flex;
`;
const CategoryTag = styled.button<{
  backgroundColor?: string;
  deleatable: boolean;
}>`
  background-color: ${({ backgroundColor }) =>
    backgroundColor ?? 'rgba(0,0,0,0.3)'};
  padding: 5px 7px;
  border-radius: 5px;
  color: #fff;
  margin: 0 5px;
  font-size: 14px;
  position: relative;
  & * {
    color: #fff;
  }
  &:hover {
    background-color: ${({ deleatable }) =>
      deleatable ? 'var(--error-color)' : ''};
    &::after {
      content: ${({ deleatable }) => (deleatable ? "'X'" : "' '")};
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
    }
  }
`;
interface Props {
  categoriesIds: string[];
  onDeleteCategory?: (categoryId: string) => void;
}

export const CategoryTags = ({ categoriesIds, onDeleteCategory }: Props) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { onFetchDocsByIdsArray } = useFirestore();

  const fetchCategories = useCallback(async () => {
    try {
      const payload = await onFetchDocsByIdsArray(
        categoriesIds,
        ENUM_COLLECTIONS.CATEGORIES
      );
      if (Array.isArray(payload.data)) {
        setCategories(payload.data);
      }
    } catch (error) {}
  }, [categoriesIds]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchCategories();
  }, [categoriesIds]);

  return (
    <CategoriesTags>
      {categories.map((category, key) => (
        <li key={key}>
          <CategoryTag
            backgroundColor={category.color}
            deleatable={Boolean(onDeleteCategory)}
            onClick={() => onDeleteCategory?.(category._id!)}>
            <FontAwesomeIcon
              style={{
                marginRight: '5px',
              }}
              icon={faTag}
            />
            {category.name}
          </CategoryTag>
        </li>
      ))}
    </CategoriesTags>
  );
};
