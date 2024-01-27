import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface INavigationRoute {
  label: string;
  href: string;
  icon?: IconProp;
}
