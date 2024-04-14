import { IAddress, ICart, IContactInformations } from '@/src/types/DBTypes';

export const isValidAddress = (address?: IAddress) => {
  if (!address) return false;
  return !!address.address && !!address.postalCode && !!address.locality && !!address.country;
};
export const isValidCartCustomerInformations = (customerInformations?: IContactInformations) => {
  if (!customerInformations) return false;
  return !!customerInformations.email && !!customerInformations.firstname && !!customerInformations.lastname && isValidAddress(customerInformations.address);
};

export const isValidCart = (cart: ICart) => {
  return cart.items?.length > 0 && cart.totalPrice > 0;
};
export const isCartStepValid = (cart: ICart | null) => {
  if (!cart) return false;
  return isValidCart(cart);
};
export const isInformationStepValid = (cart: ICart | null) => {
  return isCartStepValid(cart) && isValidCartCustomerInformations(cart?.contactInformations);
};
