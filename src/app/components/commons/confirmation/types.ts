export interface IAction {
  label: string;
  className?: string;
  callback: () => Promise<any>;
}
