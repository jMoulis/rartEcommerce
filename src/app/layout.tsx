import { ReactNode } from 'react';
import './style/globals.css';

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return children;
}
