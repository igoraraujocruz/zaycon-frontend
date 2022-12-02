type User = {
  isAdmin: boolean;
};

export function validateUserIsAdmin(user: User) {
  if (user.isAdmin === true) {
    return true;
  }
  return false;
}
