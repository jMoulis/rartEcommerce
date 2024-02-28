import { useEffect, useState } from 'react';

export const useQuantityOptions = (quantity: number = 0) => {
  const [choices, setChoices] = useState<Array<{ label: string, value: string | number }>>([]);

  useEffect(() => {
    if (quantity === 0) return;
    setChoices(
      Array.from(
        { length: quantity + 1 },
        (number: any, index) => {
          return {
            label: `${index}`,
            value: `${index}`,
          };
        }
      )
    );
  }, [quantity]);
  return choices;
};
