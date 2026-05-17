import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// ─── Synchronous helpers ──────────────────────────────────────────────────────
// Run synchronously BEFORE the first render so role/token are immediately available.
// This eliminates the "Verifying permissions…" freeze after a page refresh.

const isValid = (val) => val && val !== 'undefined' && val !== 'null';

const readStorage = (key) => {
  try {
    const v = sessionStorage.getItem(key);
    return isValid(v) ? v : null;
  } catch {
    return null;
  }
};

const readUserStorage = () => {
  try {
    // Self-heal: migrate legacy portalUser key
    const legacy = sessionStorage.getItem('portalUser');
    if (legacy && isValid(legacy)) {
      sessionStorage.setItem('employeeId', legacy);
      sessionStorage.removeItem('portalUser');
    }
    const raw = sessionStorage.getItem('user');
    return raw && isValid(raw) ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  // Lazy initializers: read sessionStorage synchronously on the very first render.
  // This means role, token, employeeId are never null on refresh — no flash/freeze.
  const [employeeId, setEmployeeId] = useState(() => readStorage('employeeId'));
  const [role,       setRole]       = useState(() => readStorage('role'));
  const [token,      setToken]      = useState(() => readStorage('token'));
  const [sessionId,  setSessionId]  = useState(() => readStorage('sessionId'));
  const [user,       setUser]       = useState(() => readUserStorage());

  const logout = useCallback(() => {
    setEmployeeId(null);
    setRole(null);
    setUser(null);
    setToken(null);
    setSessionId(null);
    sessionStorage.removeItem('employeeId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('sessionId');
  }, []);

  const login = useCallback((userData) => {
    const { employeeId: id, role: userRole, token: userToken, user: userInfo, sessionId: sid } = userData;

    // Guard: never commit incomplete auth state to context or storage.
    // If token or role are missing the login is not yet complete (e.g. MFA pending).
    if (!userToken || !userRole || !id) {
      console.warn('[Auth] login() called with incomplete data — skipping commit.', { id, userRole, hasToken: !!userToken });
      return;
    }

    setEmployeeId(id);
    setRole(userRole);
    setToken(userToken);
    setUser(userInfo || null);
    if (sid) setSessionId(sid);

    // Only write valid strings — never write "undefined" or "null"
    sessionStorage.setItem('employeeId', id);
    sessionStorage.setItem('role', userRole);
    sessionStorage.setItem('token', userToken);
    if (userInfo) sessionStorage.setItem('user', JSON.stringify(userInfo));
    if (sid) sessionStorage.setItem('sessionId', sid);
  }, []);

  // ── Security heartbeat ────────────────────────────────────────────────────
  // Validates the active session every 30 s.
  // Requires 2 consecutive failures before forcing logout — prevents false
  // kick-outs from transient network glitches or React StrictMode double-invoke.
  useEffect(() => {
    if (!token || !employeeId) return;

    let failStreak = 0;
    const MAX_FAILS = 2;

    const checkSync = async () => {
      try {
        await axios.get('http://localhost:8080/api/auth/validate-sync', {
          headers: { Authorization: `Bearer ${token}` },
        });
        failStreak = 0; // reset on success
      } catch (err) {
        failStreak += 1;
        console.warn(`[Auth] Sync check failed (${failStreak}/${MAX_FAILS}).`, err?.response?.status);
        if (failStreak >= MAX_FAILS) {
          console.warn('[Auth] Security sync lost — terminating portal session.');
          logout();
        }
      }
    };

    // Delay the first heartbeat by 2 s to let React StrictMode settle
    const firstCheck = setTimeout(checkSync, 2000);
    const interval = setInterval(checkSync, 30000);
    return () => {
      clearTimeout(firstCheck);
      clearInterval(interval);
    };
  }, [token, employeeId, logout]);

  // ── Warn on incomplete session (dev aid) ──────────────────────────────────
  useEffect(() => {
    if (employeeId && !role) {
      console.warn('[Auth] Role is missing for active session — re-authentication may be required.');
    }
  }, [employeeId, role]);

  return (
    <AuthContext.Provider value={{ employeeId, role, user, token, sessionId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
