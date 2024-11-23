import { NotFoundType } from '@/src/types/types';
import React from 'react';

export default async function NotFound(props: NotFoundType) {
  const params = await props.params;
  return (
    <div>
      Dashboard not-found{' '}
      {params?.['not-found']?.map((notFound, key) => (
        <span key={key}>{notFound}</span>
      ))}
    </div>
  );
}
