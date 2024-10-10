import { IArtwork, IProductService, IWorkshop } from '@/src/types/DBTypes';
import { useEffect, useRef, useState } from 'react';

export const useCategories = (initialData: Array<IProductService | IWorkshop | IArtwork>) => {
  const [filteredData, setFilteredData] = useState<Array<IProductService | IWorkshop | IArtwork>>(initialData);
  const [selectedCategories, setCategories] = useState<string[]>(['ALL']);
  const unfilteredProducts = useRef<Array<IProductService | IWorkshop | IArtwork>>(initialData);

  useEffect(() => {
    if (selectedCategories.length === 0 || selectedCategories.includes('ALL')) {
      setFilteredData(unfilteredProducts.current);
    } else {
      const filteredProducts = unfilteredProducts.current.filter((product) =>
        selectedCategories.some((category) =>
          product.categories?.includes(category)
        )
      );
      setFilteredData(filteredProducts);
    }
  }, [selectedCategories]);

  const onSelectCategory = (category: string) => {
    setCategories([category]);
    // if (selectedCategories.includes(category)) {
    //   setCategories(selectedCategories.filter((cat) => cat !== category));
    // } else {
    //   setCategories([...selectedCategories, category]);
    // }
  };

  const onUpdateData = (data: Array<IProductService | IWorkshop>) => {
    unfilteredProducts.current = data;
    setFilteredData(data);
  };
  return {
    filteredData,
    onSelectCategory,
    onUpdateData,
    selectedCategories,
  };
};
