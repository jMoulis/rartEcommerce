'use client';

import Error from 'next/error';
import { defaultLocale } from '../intl/config';

export default function NotFound() {
  return (
    <html lang={defaultLocale}>
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
