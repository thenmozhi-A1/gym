/**
 * authRoutes.js
 * Central config for role-to-route mapping.
 *
 * To add a new role (e.g. "MANAGER"), simply add an entry here.
 * The matcher supports both exact strings and substring checks via the `includes` array.
 */

/**
 * Role routing config.
 * Each entry is checked in order. The first match wins.
 *
 * @type {Array<{ exact?: string[], includes?: string[], route: string }>}
 */
export const ROLE_ROUTE_CONFIG = [
  {
    // Admin gets the admin dashboard
    exact: ['ADMIN'],
    route: '/AdminDashboard',
  },
  {
    // Staff roles get the employee dashboard
    exact: ['TRAINER', 'STAFF', 'FRONT OFFICE', 'MANAGER'],
    includes: ['TRAINER', 'OFFICE', 'STAFF', 'MANAGER'],
    route: '/EmployeeDashboard',
  },
  {
    // All other authenticated users (members) get the user dashboard
    exact: ['USER', 'MEMBER'],
    route: '/userdashboard',
  },
];

/** Fallback for any role not matched by the config above */
export const DEFAULT_ROUTE = '/userdashboard';

/**
 * Resolves the correct post-login route for a given role string.
 *
 * @param {string} role  The role string from the backend (e.g. "ADMIN", "TRAINER")
 * @returns {string}     The React Router path to navigate to
 */
export function resolveRouteForRole(role) {
  const normalised = (role || '').toString().trim().toUpperCase();

  for (const config of ROLE_ROUTE_CONFIG) {
    const exactMatch    = config.exact?.includes(normalised);
    const includesMatch = config.includes?.some(kw => normalised.includes(kw));
    if (exactMatch || includesMatch) {
      return config.route;
    }
  }

  return DEFAULT_ROUTE;
}

/**
 * Performs the post-login navigation. Uses window.location.href for a full
 * page reload (needed to flush Zustand state into React Router context after
 * the login store hydration).
 *
 * If `mustChangePassword` is true, always redirects to /change-password first.
 *
 * @param {object} user  The user object returned by the login API
 */
export function redirectAfterLogin(user) {
  if (!user) {
    window.location.href = DEFAULT_ROUTE;
    return;
  }

  if (user.mustChangePassword) {
    window.location.href = '/change-password';
    return;
  }

  window.location.href = resolveRouteForRole(user.role);
}
