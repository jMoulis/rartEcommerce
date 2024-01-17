import { NotFoundType } from '@/src/types/types';
import React from 'react';

export default function NotFound({ params }: NotFoundType) {
  return (
    <div>
      Dashboard not-found{' '}
      {params?.['not-found']?.map((notFound, key) => (
        <span key={key}>{notFound}</span>
      ))}
    </div>
  );
}
