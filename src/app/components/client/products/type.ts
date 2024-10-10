import { ChangeEvent } from 'react';

export type CustomChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
