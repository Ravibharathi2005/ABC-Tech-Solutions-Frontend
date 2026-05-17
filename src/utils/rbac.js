/**
 * RBAC Configuration — Single Source of Truth
 *
 * This file defines which roles can access which portal routes.
 * Used by RoleGuard.jsx to enforce access at the route level.
 *
 * Rules:
 * - If a route is not listed here it is treated as PUBLIC (accessible to any authenticated user).
 * - 'allowedRoles' is an allowlist. Any role NOT in the list will be denied.
 */

export const ROLES = {
  SUPER_ADMIN:      'SUPER_ADMIN',
  ADMIN:            'ADMIN',
  HR:               'HR',
  MANAGER:          'MANAGER',
  SECURITY_ANALYST: 'SECURITY_ANALYST',
  EMPLOYEE:         'EMPLOYEE',
};

// Roles that count as "elevated" for general restricted checks
export const ADMIN_ROLES   = [ROLES.ADMIN, ROLES.SUPER_ADMIN];
export const MANAGER_ROLES = [ROLES.MANAGER, ROLES.HR, ...ADMIN_ROLES];
export const ALL_ROLES     = Object.values(ROLES);

/**
 * Route access map.
 * Key   = relative path segment (matches <Route path="..."> in App.jsx)
 * Value = array of roles allowed to access that route
 *
 * Routes not listed here default to ALL authenticated users.
 */
export const ROUTE_ACCESS = {
  // ── Visible to ALL authenticated roles ──────────────────────────────
  '':             ALL_ROLES,   // /portal index → Dashboard
  'profile':      ALL_ROLES,
  'attendance':   ALL_ROLES,
  'tasks':        ALL_ROLES,
  'salary':       ALL_ROLES,
  'leave':        ALL_ROLES,
  'tools':        ALL_ROLES,

  // ── Management / HR layer ─────────────────────────────────────────
  'reports': [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.HR,
    ROLES.MANAGER,
    ROLES.SECURITY_ANALYST,
  ],

  // ── Admin & Executive only ────────────────────────────────────────
  'confidential': [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
  ],

  'admin': [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
  ],
};

/**
 * Human-readable label for each role (used in UI badges etc.)
 */
export const ROLE_LABELS = {
  SUPER_ADMIN:      'Super Admin',
  ADMIN:            'Administrator',
  HR:               'HR Manager',
  MANAGER:          'Manager',
  SECURITY_ANALYST: 'Security Analyst',
  EMPLOYEE:         'Employee',
};

/**
 * Check if a given role is allowed to access a route segment.
 * @param {string} role        - e.g. 'EMPLOYEE'
 * @param {string} routeKey    - e.g. 'admin'
 * @returns {boolean}
 */
export const canAccess = (role, routeKey) => {
  const allowed = ROUTE_ACCESS[routeKey];
  if (!allowed) return true; // not listed → open to all authenticated users
  return allowed.includes(role);
};
