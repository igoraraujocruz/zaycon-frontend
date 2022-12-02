import { validateUserIsAdmin } from '../../utils/validateUserPermissions';
import { useAuth } from './useAuth';

export function useCan() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const hasPermission = validateUserIsAdmin(
    user
  );

  return hasPermission;
}
