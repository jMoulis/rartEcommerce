import { useCart } from '@/src/app/contexts/cart/CartContext';
import { useEffect, useState } from 'react';
import {
  fetchServicePoints,
  fetchShippingMethods
} from '../../../dashboard/actions';
import {
  IAddress,
  ICartItem,
  IShippingRequest,
  IVendor
} from '@/src/types/DBTypes';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findDocumentById } from '@/src/app/contexts/firestore/useFirestore';

const generateShippingRequest = (
  product: ICartItem,
  venderShippingAddress: IAddress,
  customAddress: IAddress
) => {
  const hardCodedUnits = {
    weight: 'gram',
    size: 'centimeter'
  };
  const shippingRequest: IShippingRequest = {
    from_country: venderShippingAddress.countryCode?.toUpperCase() ?? 'FR',
    to_country: customAddress.countryCode?.toUpperCase() ?? '',
    from_postal_code: venderShippingAddress.postalCode || '',
    weight: product?.delivery?.weight ? String(product.delivery.weight) : '',
    weight_unit: product?.delivery?.weight ? hardCodedUnits.weight : '',
    height: product?.delivery?.height ? String(product.delivery.height) : '',
    height_unit: product?.delivery?.height ? hardCodedUnits.size : '',
    length: product?.delivery?.length ? String(product.delivery.length) : '',
    length_unit: product?.delivery?.length ? hardCodedUnits.size : '',
    width: product?.delivery?.width ? String(product.delivery.width) : '',
    width_unit: product?.delivery?.width ? hardCodedUnits.size : ''
  };
  const filteredRequest = Object.fromEntries(
    Object.entries(shippingRequest).filter(
      ([, value]) => value !== undefined && value !== ''
    )
  );
  return filteredRequest as IShippingRequest;
};

function DeliverySelector() {
  const { cart, addDeliveryCost } = useCart();
  const [shippingMethods, setShippingMethods] = useState<
    Array<{
      carrier: string;
      cheapestMethod: {
        currency: string;
        id: number;
        name: string;
        price: string;
      };
    }>
  >([]);
  const [venderShippingAddress, setVenderShippingAddress] =
    useState<IAddress | null>(null);

  useEffect(() => {
    const vendorId = process.env.NEXT_PUBLIC_STORE_ID;
    if (!vendorId) return;
    findDocumentById(vendorId, ENUM_COLLECTIONS.VENDORS).then(({ data }) => {
      if (!data) return;
      const vendor = data as IVendor;
      const shippingAddress = vendor.shippingAddress;
      if (!shippingAddress) {
        setVenderShippingAddress(null);
        return;
      }
      setVenderShippingAddress(shippingAddress);
    });
  }, []);

  const getMethods = async () => {
    if (!cart?.contactInformations.shippingAddress || !venderShippingAddress) {
      return;
    }

    const customerCountry =
      cart.contactInformations.shippingAddress.countryCode?.toUpperCase();
    if (!customerCountry) return;

    const getTheHeaviestProduct = (items: ICartItem[]) => {
      return items.reduce((prev, current) => {
        if (!prev.delivery?.weight) return current;
        if (!current.delivery?.weight) return prev;
        return parseFloat(prev.delivery.weight) >
          parseFloat(current.delivery.weight)
          ? prev
          : current;
      });
    };
    const cartItem = getTheHeaviestProduct(cart.items);
    const shippingRequest = generateShippingRequest(
      cartItem,
      venderShippingAddress,
      cart?.contactInformations.shippingAddress
    );
    fetchShippingMethods(shippingRequest).then((data: any) => {
      const getOneCheapestOptionPerCarrier = (data: any[]) => {
        // Group by carrier and find the cheapest method overall for each carrier
        const carrierCheapestOptions: Record<string, any> = {};

        data.forEach(({ carrier, methods }) => {
          methods.forEach((method: any) => {
            const currentPrice = parseFloat(method.prices[0].price);

            if (
              !carrierCheapestOptions[carrier] ||
              currentPrice <
                parseFloat(carrierCheapestOptions[carrier].prices[0].price)
            ) {
              carrierCheapestOptions[carrier] = method;
            }
          });
        });

        // Transform the result into an array
        const result = Object.entries(carrierCheapestOptions).map(
          ([carrier, method]) => ({
            carrier,
            cheapestMethod: {
              id: method.id,
              name: method.name,
              price: method.prices[0].price,
              currency: method.prices[0].currency
            }
          })
        );
        return result.sort(
          (a, b) => a.cheapestMethod.price - b.cheapestMethod.price
        );
      };
      setShippingMethods(getOneCheapestOptionPerCarrier(data));
    });
  };
  useEffect(() => {
    if (!cart || !venderShippingAddress) return;
    getMethods();
  }, [cart, venderShippingAddress]);

  const handleSelectServicePoint = async (servicePointId: string) => {
    const address = cart?.contactInformations.shippingAddress;
    if (!address) return;
    const parsedAddress = {
      country: address.countryCode?.toUpperCase() ?? '',
      postal_code: address.postalCode
    };

    await fetchServicePoints(servicePointId, parsedAddress).then(
      (data: any) => {
        // console.log(data);
      }
    );
  };
  const handleSelectProvider = async (price: string) => {
    const parsedPrice = parseFloat(price);
    addDeliveryCost(parsedPrice);
  };

  return (
    <div>
      <button type='button' onClick={getMethods}>
        Get
      </button>
      <ul>
        {shippingMethods.map((item) => (
          <li key={item.carrier}>
            {item.carrier?.includes('mondial') ? (
              <button
                onClick={async () => handleSelectServicePoint(item.carrier)}>
                Select service point
              </button>
            ) : null}
            <button
              type='button'
              onClick={async () =>
                handleSelectProvider(item.cheapestMethod.price)
              }>
              <span>{item.carrier}</span>
              <span>{item.cheapestMethod.price}</span>
              <span>{item.cheapestMethod.currency}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default DeliverySelector;
