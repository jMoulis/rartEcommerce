import { Suspense } from 'react';
import SuspendedPage from './SuspendedPage';

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspendedPage />
    </Suspense>
  );
}
