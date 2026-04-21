import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  useEffect(() => {
    const savedId = sessionStorage.getItem('employeeId');
    const savedRole = sessionStorage.getItem('role');
    const savedToken = sessionStorage.getItem('token');
    const savedUserString = sessionStorage.getItem('user');

    // 🛡️ Safety check: Ensure values are present and not the literal string "undefined"
    const isValid = (val) => val && val !== "undefined";

    if (isValid(savedId) && isValid(savedRole) && isValid(savedToken)) {
      setEmployeeId(savedId);
      setRole(savedRole);
      setToken(savedToken);
      
      try {
        if (isValid(savedUserString)) {
          setUser(JSON.parse(savedUserString));
        }
      } catch (e) {
        console.error("Critical Auth Sync Error: Corrupted user object detected.", e);
        logout(); // Force cleanup of corrupted session
      }
    } else {
      // If any core part is "undefined", clear everything to be safe
      if (savedId === "undefined" || savedRole === "undefined" || savedToken === "undefined") {
        logout();
      }
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
