import { ReactNode } from 'react';
import { useCan } from '../services/hooks/useCan';

interface CanProps {
  children: ReactNode;
}

export function Can({ children }: CanProps) {
  const userCanSeeComponent = useCan();

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
}
