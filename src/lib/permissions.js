/**
 * Utility to check if a user has specific module permissions.
 * @param {Object} user - The user object (usually from session.user)
 * @param {string} moduleName - The module to check (e.g., 'users', 'finance', 'merchandise')
 * @param {string} action - The action to check ('create', 'read', 'update', 'delete'). Default is 'read'.
 * @returns {boolean} - true if the user has permission, false otherwise.
 */
export function hasAccess(user, moduleName, action = 'read') {
  if (!user || !user.roleName) return false;

  if (user.roleName === 'SUPER_ADMIN') return true;

  const perms = user.permissions || {};
  
  if (perms['all'] && Array.isArray(perms['all'])) {
    if (perms['all'].includes(action)) return true;
  }

  if (perms[moduleName] && Array.isArray(perms[moduleName])) {
    return perms[moduleName].includes(action);
  }

  return false;
}
