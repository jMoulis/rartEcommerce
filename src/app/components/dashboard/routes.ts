import { faBoxesStacked, faCalendarWeek, faCartCircleCheck, faCartCircleExclamation, faFileInvoice, faReceipt, faRotateLeft, faSackDollar, faShelves, faTableLayout, faTags, faUsers } from '@fortawesome/pro-light-svg-icons';
import { INavigationRoute } from '../navbar/types';

const ROOT = 'dashboard';

export enum ENUM_DASHBOARD_MENU_ROUTES {
  WORKSHOPS = `/${ROOT}/workshops`,
  WORKSHOPS_CREATE = `/${ROOT}/workshops/create`,
}

export const dashboardRoutes = (t: any): Array<{ label: string, menus: INavigationRoute[] }> => [{
  label: t('Dashboard.orders'),
  menus: [{
    label: t('Dashboard.orders'),
    href: '/dashboard/orders',
    icon: faCartCircleCheck
  }, {
    label: t('Dashboard.abandonedCarts'),
    href: '/dashboard/orders/abandonedCarts',
    icon: faCartCircleExclamation
  }],

}, {
  label: t('Dashboard.products'),
  menus: [{
    label: t('Dashboard.products'),
    href: '/dashboard/products',
    icon: faBoxesStacked
  }, {
    label: t('Dashboard.inventory'),
    href: '/dashboard/products/inventory',
    icon: faShelves
  },
  {
    label: t('Dashboard.categories'),
    href: '/dashboard/products/categories',
    icon: faTags
  }]

}, {
  label: t('Dashboard.workshops'),
  menus: [{
    label: t('Dashboard.workshops'),
    href: '/dashboard/workshops',
    icon: faCalendarWeek
  }]

}, {
  label: t('Dashboard.customers'),
  menus: [{
    label: t('Dashboard.customers'),
    href: '/dashboard/customers',
    icon: faUsers
  }]
}, {
  label: t('Dashboard.financial'),
  menus: [{
    label: t('Dashboard.payments'),
    href: '/dashboard/financial/payments',
    icon: faSackDollar
  }, {
    label: t('Dashboard.estimates'),
    href: '/dashboard/financial/estimates',
    icon: faReceipt
  }, {
    label: t('Dashboard.billings'),
    href: '/dashboard/financial/billings',
    icon: faFileInvoice
  }, {
    label: t('Dashboard.subscriptions'),
    href: '/dashboard/financial/subscriptions',
    icon: faRotateLeft
  }],
}, {
  label: t('Dashboard.templates'),
  menus: [{
    label: t('Dashboard.templates'),
    href: '/dashboard/templates',
    icon: faTableLayout
  }]
}];
