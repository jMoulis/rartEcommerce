import { CartSession } from '@/src/app/contexts/cart/CartSession';
import { Breadcrumb } from '../../../components/client/checkout/processing/commons/Breadcrumb';

interface Props {
  children: React.ReactNode;
}

export default async function CheckoutLayoutRoot({ children }: Props) {
  return (
    <CartSession>
      <Breadcrumb />
      {children}
    </CartSession>
  );
}
