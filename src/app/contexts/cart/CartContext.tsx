'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  IAddress,
  ICart,
  ICartItem,
  IProductService,
  IWorkshop,
} from '@/src/types/DBTypes';
import { v4 } from 'uuid';
import { DEFAULT_CURRENCY } from '@/src/lib/constants';

// Define a type for the context value
interface CartContextType {
  cart: ICart | null;
  addToCart: (item: IProductService | IWorkshop) => void;
  addDeliveryCost: (cost: number) => void;
  clearCart: () => void;

  addContactInformations: (value: {
    email: string;
    address: IAddress;
    firstname: string;
    lastname: string;
  }) => void;
}

const defaultState = {
  cart: null,
  addToCart: () => {},
  addDeliveryCost: () => {},
  clearCart: () => {},
  addContactInformations: () => {},
};
const defaultCart: ICart = {
  items: [],
  currency: DEFAULT_CURRENCY,
  totalItems: 0,
  totalPrice: 0,
  totalPriceAndDelivery: 0,
};
// Create a context with a default value
const CartContext = createContext<CartContextType>(defaultState);

function isProductService(item: any): item is IProductService {
  return (item as IProductService).images !== undefined;
}
function isWorkshop(item: any): item is IProductService {
  return (item as IWorkshop).image !== undefined;
}
const getImageUrl = (item: IProductService | IWorkshop) => {
  if (isProductService(item)) {
    const image = item.images.find((prev) => prev.default) ?? item.images[0];
    return image?.url;
  }
  if (isWorkshop(item)) {
    return item.image?.url;
  }
};
// Cart provider component with type for children
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<ICart | null>(null);

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, []);

  const addToCart = (item: IProductService | IWorkshop) => {
    const updatedCart: ICart = cart ? { ...cart } : defaultCart;

    const existingItemIndex = updatedCart.items.findIndex(
      (cartItem) => cartItem.productId === item._id
    );
    if (existingItemIndex > -1) {
      // Item exists, increment quantity
      updatedCart.items[existingItemIndex].quantity += 1;
    } else {
      const imageUrl = getImageUrl(item);
      const newItem: ICartItem = {
        id: v4(), // Unique identifier for the cart item
        productId: item._id!,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl,
        currency: DEFAULT_CURRENCY,
        description: item.description,
      };
      updatedCart.items.push(newItem);
    }

    updatedCart.totalItems = updatedCart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    updatedCart.totalPrice = updatedCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const addDeliveryCost = (cost: number) => {
    setCart((prev) =>
      prev
        ? {
            ...prev,
            deliveryCost: cost,
            totalPriceAndDelivery: prev.totalPrice + cost,
          }
        : null
    );
  };

  const addContactInformations = (value: {
    email: string;
    address: IAddress;
    firstname: string;
    lastname: string;
  }) => {
    if (cart) {
      const updatedCart: ICart = {
        ...cart,
        contactInformations: value,
      };
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };
  const clearCart = () => {
    setCart(null);
    localStorage.removeItem('cart');
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addDeliveryCost,
        clearCart,
        addContactInformations,
      }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
