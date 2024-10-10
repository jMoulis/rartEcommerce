import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface IAction {
  label?: string;
  style?: React.CSSProperties;
  callback: () => Promise<any>;
  icon?: IconProp
}
