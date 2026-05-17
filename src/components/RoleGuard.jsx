import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccess } from '../utils/rbac';
import { logActivity } from '../utils/activityLogger';
import { FiLock, FiAlertCircle } from 'react-icons/fi';

/**
 * RoleGuard — wraps a route element and enforces RBAC.
 *
 * Props:
 *   routeKey   {string}   - matches a key in ROUTE_ACCESS (e.g. 'admin', 'reports')
 *   children   {JSX}      - the page component to render if access is allowed
 *   redirectTo {string}   - optional redirect path on denial (default: shows access denied UI)
 *
 * Behaviour:
 *   - If role is null/undefined (still loading) → shows nothing (avoids flash of denied page)
 *   - If role is authorised       → renders children normally
 *   - If role is NOT authorised   → renders a styled "Access Denied" screen and logs the attempt
 */
const RoleGuard = ({ routeKey, children, redirectTo }) => {
  const { role, employeeId } = useAuth();
  const location = useLocation();

  // If role is null the user is not authenticated at all — redirect to login.
  // With synchronous lazy initializers in AuthContext this should never render
  // for a valid session, but acts as a safety net for direct URL access without auth.
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccess(role, routeKey)) {
    // Log the unauthorized attempt to the monitoring system
    logActivity(
      employeeId,
      `UNAUTHORIZED_ACCESS_ATTEMPT: /${routeKey}`,
      { attemptedRoute: location.pathname, userRole: role, riskLevel: 'High' }
    );

    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <div className="page-container" style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'
      }}>
        <div className="card" style={{
          maxWidth: '480px', width: '100%', textAlign: 'center',
          padding: '4rem 3rem', borderTop: '4px solid var(--danger-color)',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'rgba(239,68,68,0.1)', borderRadius: '50%',
            margin: '0 auto 2rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--danger-color)'
          }}>
            <FiLock size={32} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Access Denied
          </h2>

          <p style={{
            color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem',
            marginBottom: '2rem'
          }}>
            Your current role <strong style={{ color: 'var(--text-primary)' }}>
              ({role?.replace('_', ' ')})
            </strong> does not have permission to view this page.
          </p>

          <div style={{
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: '12px', padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left'
          }}>
            <FiAlertCircle style={{ color: 'var(--danger-color)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              This access attempt has been recorded and sent to the Security Operations Centre.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
