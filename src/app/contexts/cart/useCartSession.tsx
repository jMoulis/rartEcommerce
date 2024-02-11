import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import { useEffect } from 'react';
import { ENUM_ROUTES } from '../../components/navbar/routes.enums';

export const useCartSession = () => {
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!cart) {
      router.push(ENUM_ROUTES.CHECKOUT);
    }
  }, [cart]);
};
