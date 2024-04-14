import { CartSession } from '@/src/app/contexts/cart/CartSession';
import { CheckoutCartControl } from '../../components/client/checkout/CheckoutCartControl';

interface Props {
  children?: React.ReactNode;
}
export default async function RootLayout({ children }: Props) {
  return (
    <CartSession>
      <CheckoutCartControl>{children}</CheckoutCartControl>
    </CartSession>
  );
}
