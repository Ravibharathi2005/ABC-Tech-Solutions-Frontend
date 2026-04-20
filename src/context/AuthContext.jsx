import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    // Check session storage on mount
    const savedId = sessionStorage.getItem('employeeId');
    if (savedId) {
      setEmployeeId(savedId);
    }

    // Cross-Tab Logout Listener for Context state wipe
    const handleStorageChange = (e) => {
      if (e.key === 'forceLogout') {
        setEmployeeId(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (id) => {
    sessionStorage.setItem('employeeId', id);
    setEmployeeId(id);
  };

  const logout = () => {
    sessionStorage.removeItem('employeeId');
    setEmployeeId(null);
  };

  return (
    <AuthContext.Provider value={{ employeeId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
