import { Suspense } from 'react';
import { LoadingSpinner } from './ui/loading-spinner';

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

export function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}
