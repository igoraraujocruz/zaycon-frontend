import { useAuth } from './useAuth';

export function useSellerIsAdmin() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const sellerIsAdmin = user.isAdmin;

  return sellerIsAdmin;
}
