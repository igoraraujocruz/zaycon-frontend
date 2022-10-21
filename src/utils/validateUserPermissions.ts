type Permission = {
  id: string;
  name: string;
};

type User = {
  permissions?: Permission[];
};

type ValidadeUserPermissionsParams = {
  user: User;
  permissions?: string[];
};

export function validateUserPermissions({
  user,
  permissions,
}: ValidadeUserPermissionsParams) {
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.some(permission => {
      return user.permissions.find(userPermissions =>
        userPermissions.name?.includes(permission),
      );
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  return true;
}
