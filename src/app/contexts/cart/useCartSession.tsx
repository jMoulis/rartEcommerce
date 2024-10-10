import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import { useEffect, useState } from 'react';
import { ENUM_ROUTES } from '../../components/navbar/routes.enums';

export const useCartSession = () => {
  const [init, setInit] = useState(false);
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!init) {
      setInit(true);
    }
  }, [init]);

  useEffect(() => {
    if (!cart && init) {
      router.push(ENUM_ROUTES.CHECKOUT);
    }
  }, [cart]);
};
