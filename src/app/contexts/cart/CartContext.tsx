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
  ISession,
  IWorkshop,
} from '@/src/types/DBTypes';
import { v4 } from 'uuid';
import { DEFAULT_CURRENCY } from '@/src/lib/constants';

// Define a type for the context value
interface CartContextType {
  cart: ICart | null;
  addToCart: (
    item: IProductService | IWorkshop,
    type: 'workshop' | 'product'
  ) => void;
  onEditCart: (item: ICartItem) => void;
  addDeliveryCost: (cost: number) => void;
  onDeleteItemFromCart: (itemId: string) => void;
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
  onEditCart: () => {},
  onDeleteItemFromCart: () => {},
};
const defaultCart: ICart = {
  items: [],
  currency: DEFAULT_CURRENCY,
  totalItems: 0,
  totalPrice: 0,
  contactInformations: {
    firstname: '',
    lastname: '',
    email: '',
  },
  deliveryCost: 0,
};
// Create a context with a default value
const CartContext = createContext<CartContextType>(defaultState);

function isProductService(item: any): item is IProductService {
  return (item as IProductService).images !== undefined;
}

const getImageUrl = (item: IProductService | IWorkshop | ISession) => {
  if (isProductService(item)) {
    const image = item.images.find((prev) => prev.default) ?? item.images[0];
    return image?.url;
  }
  return (item as IWorkshop).image?.url;
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
      if (item.type === 'workshop') {
        const imageUrl = getImageUrl(item);
        const incomingItem = item as IWorkshop;
        const newItem: ICartItem = {
          id: v4(), // Unique identifier for the cart item
          productId: item._id!,
          name: incomingItem.name,
          price: incomingItem.price,
          quantity: 1,
          imageUrl,
          currency: incomingItem.currency || DEFAULT_CURRENCY,
          description: incomingItem.description,
          type: item.type,
          sessions: incomingItem.sessions,
          stock: null,
        };
        const prevElement = updatedCart.items[existingItemIndex];
        const updatedElement = {
          ...prevElement,
          sessions: [
            ...(prevElement.sessions ?? []),
            ...(newItem.sessions ?? []),
          ],
        };
        updatedCart.items[existingItemIndex] = updatedElement;
      } else {
        // Item exists, increment quantity
        updatedCart.items[existingItemIndex].quantity += 1;
      }
    } else {
      const imageUrl = getImageUrl(item);

      const incomingItem = item as IProductService;
      const newItem: ICartItem = {
        id: v4(), // Unique identifier for the cart item
        productId: item._id!,
        name: incomingItem.name,
        price: incomingItem.price,
        quantity: 1,
        imageUrl,
        currency: incomingItem.currency || DEFAULT_CURRENCY,
        description: incomingItem.description,
        type: item.type,
        stock: incomingItem.withStock ? incomingItem.stockQuantity : null,
        sessions: (incomingItem as any).sessions,
      };
      updatedCart.items.push(newItem);
    }

    const sessionsTotal = updatedCart.items
      .filter((i) => i.type === 'workshop')
      .reduce((total, cartItem) => {
        return total + (cartItem.sessions?.length ?? 1);
      }, 0);
    const productTotal = updatedCart.items
      .filter((i) => i.type === 'product')
      .reduce((total, cartItem) => total + cartItem.quantity, 0);

    const productTotalPrice = updatedCart.items
      .filter((i) => i.type === 'product')
      .reduce(
        (total, cartItem) => total + cartItem.price * cartItem.quantity,
        0
      );
    const sessionsTotalPrice = updatedCart.items
      .filter((i) => i.type === 'workshop')
      .reduce(
        (total, cartItem) =>
          total + cartItem.price * (cartItem.sessions?.length ?? 1),
        0
      );
    updatedCart.totalItems = sessionsTotal + productTotal;
    updatedCart.totalPrice = sessionsTotalPrice + productTotalPrice;
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const addDeliveryCost = (cost: number) => {
    setCart((prev) =>
      prev
        ? {
            ...prev,
            deliveryCost: cost,
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
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  const onEditCart = (cartItem: ICartItem) => {
    if (!cart) return;
    const updatedCart = {
      ...cart,
      items: cart?.items.map((prevItem) =>
        prevItem.id === cartItem.id ? cartItem : prevItem
      ),
    };

    const productTotal = updatedCart.items
      .filter((i) => i.type === 'product')
      .reduce((total, cartItem) => total + cartItem.quantity, 0);

    const sessionsTotal = updatedCart.items
      .filter((i) => i.type === 'workshop')
      .reduce((total, cartItem) => {
        return total + (cartItem.sessions?.length ?? 1);
      }, 0);

    const productTotalPrice = updatedCart.items
      .filter((i) => i.type === 'product')
      .reduce(
        (total, cartItem) => total + cartItem.price * cartItem.quantity,
        0
      );
    const sessionsTotalPrice = updatedCart.items
      .filter((i) => i.type === 'workshop')
      .reduce(
        (total, cartItem) =>
          total + cartItem.price * (cartItem.sessions?.length ?? 1),
        0
      );
    updatedCart.totalItems = sessionsTotal + productTotal;
    updatedCart.totalPrice = sessionsTotalPrice + productTotalPrice;

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const onDeleteItemFromCart = (itemId: string) => {
    if (!cart) return;

    const updatedCart = {
      ...cart,
      items: cart?.items.filter((prevItem) => prevItem.id !== itemId),
    };

    const sessionsTotal = updatedCart.items
      .filter((i) => i.type === 'workshop')
      .reduce((total, cartItem) => {
        return total + (cartItem.sessions?.length ?? 1);
      }, 0);

    const productTotal = updatedCart.items
      .filter((i) => i.type === 'product')
      .reduce((total, cartItem) => total + cartItem.quantity, 0);

    const productTotalPrice = updatedCart.items
      .filter((i) => i.type === 'product')
      .reduce(
        (total, cartItem) => total + cartItem.price * cartItem.quantity,
        0
      );
    const sessionsTotalPrice = updatedCart.items
      .filter((i) => i.type === 'workshop')
      .reduce(
        (total, cartItem) =>
          total + cartItem.price * (cartItem.sessions?.length ?? 1),
        0
      );
    updatedCart.totalItems = sessionsTotal + productTotal;
    updatedCart.totalPrice = sessionsTotalPrice + productTotalPrice;

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
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
        onEditCart,
        onDeleteItemFromCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
