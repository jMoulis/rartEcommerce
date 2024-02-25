import { CartSession } from '@/src/app/contexts/cart/CartSession';
import { Breadcrumb } from '../../../components/client/checkout/processing/commons/Breadcrumb';
import { CheckoutCartControl } from '@/src/app/components/client/checkout/CheckoutCartControl';

interface Props {
  children: React.ReactNode;
}

export default async function CheckoutLayoutRoot({ children }: Props) {
  return (
    <CartSession>
      <CheckoutCartControl>
        <Breadcrumb />
        {children}
      </CheckoutCartControl>
    </CartSession>
  );
}
