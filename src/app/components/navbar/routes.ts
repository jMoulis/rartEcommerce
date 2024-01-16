import { faStore } from '@fortawesome/pro-light-svg-icons';
import { INavigationRoute } from './types';

export const navRoutes = (t: any): INavigationRoute[] => [{
  label: t('Navbar.store'),
  href: '/',
  icon: faStore
}];
