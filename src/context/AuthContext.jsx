import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employeeId, setEmployeeId] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const logout = useCallback(() => {
    setEmployeeId(null);
    setRole(null);
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('employeeId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }, []);

  const login = useCallback((userData) => {
    const { employeeId: id, role: userRole, token: userToken, user: userInfo } = userData;
    setEmployeeId(id);
    setRole(userRole);
    setToken(userToken);
    setUser(userInfo);

    sessionStorage.setItem('employeeId', id);
    sessionStorage.setItem('role', userRole);
    sessionStorage.setItem('token', userToken);
    sessionStorage.setItem('user', JSON.stringify(userInfo));
  }, []);

  // Unified Synchronized Authentication Heartbeat
  useEffect(() => {
    if (!token || !employeeId) return;

    const checkSync = async () => {
      try {
        await axios.get("http://localhost:8080/api/auth/validate-sync", {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn("Security Sync Lost: Forced termination of Portal session.");
        logout();
      }
    };

    // Immediate check on initialization/route change
    checkSync();

    // Periodic heartbeat
    const interval = setInterval(checkSync, 30000); // 30s interval
    return () => clearInterval(interval);
  }, [token, employeeId, logout]);

  useEffect(() => {
    // 🛡️ Self-Healing: Clean up legacy keys from older versions
    if (sessionStorage.getItem('portalUser')) {
      const legacyId = sessionStorage.getItem('portalUser');
      sessionStorage.setItem('employeeId', legacyId);
      sessionStorage.removeItem('portalUser');
    }

    const savedId = sessionStorage.getItem('employeeId');
    const savedRole = sessionStorage.getItem('role');
    const savedToken = sessionStorage.getItem('token');
    const savedUserString = sessionStorage.getItem('user');

    // 🛡️ Safety check: Ensure values are present and not the literal string "undefined"
    const isValid = (val) => val && val !== "undefined";

    // Re-hydrate core auth state
    if (isValid(savedId)) setEmployeeId(savedId);
    if (isValid(savedRole)) setRole(savedRole);
    if (isValid(savedToken)) setToken(savedToken);
    
    // De-couple user object hydration from core state to prevent "all-or-nothing" failures
    try {
      if (isValid(savedUserString)) {
        setUser(JSON.parse(savedUserString));
      }
    } catch (e) {
      console.warn("Auth Hydration: Corrupted user object detected. Keeping personnel ID.", e);
    }

    // Secondary check: If role is missing but ID is present, we might be in a legacy session
    if (isValid(savedId) && !isValid(savedRole)) {
      console.warn("Auth Hydration: Missing role for active ID. Session requires re-authentication.");
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      employeeId,
      role,
      user,
      token,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
