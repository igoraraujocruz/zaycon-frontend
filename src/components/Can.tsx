import { ReactNode } from 'react';
import { useSellerIsAdmin } from '../services/hooks/useCan';

interface CanProps {
  children: ReactNode;
}

export function Admin({ children }: CanProps) {
  const userCanSeeComponent = useSellerIsAdmin();

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
}
