import { faStore } from '@fortawesome/pro-light-svg-icons';
import { INavigationRoute } from './types';

export const navRoutes = (t: any): INavigationRoute[] => [{
  label: t('Navbar.home'),
  href: '/',
  icon: faStore
}, {
  label: t('Navbar.products'),
  href: '/products',
  icon: faStore
}, {
  label: t('Navbar.workshop'),
  href: '/workshops',
  icon: faStore
}, {
  label: t('Navbar.about'),
  href: '/about',
  icon: faStore
},
{
  label: t('Navbar.reviews'),
  href: '/reviews',
  icon: faStore
}, {
  label: t('Navbar.contact'),
  href: '/contact',
  icon: faStore
}, {
  label: t('Navbar.gallery'),
  href: '/gallery',
  icon: faStore
},
];
