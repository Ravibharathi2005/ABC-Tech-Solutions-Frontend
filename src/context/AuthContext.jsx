import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employeeId, setEmployeeId] = useState(null);
  const [role, setRole] = useState(null);
  const [trustScore, setTrustScore] = useState(100);
  const [riskLevel, setRiskLevel] = useState('LOW');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check session storage on mount
    const savedId = sessionStorage.getItem('employeeId');
    const savedRole = sessionStorage.getItem('role');
    const savedTrustScore = sessionStorage.getItem('trustScore');
    const savedRiskLevel = sessionStorage.getItem('riskLevel');
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');

    if (savedId) {
      setEmployeeId(savedId);
      setRole(savedRole || 'EMPLOYEE');
      setTrustScore(parseInt(savedTrustScore) || 100);
      setRiskLevel(savedRiskLevel || 'LOW');
      setToken(savedToken);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }

    // Cross-Tab Logout Listener for Context state wipe
    const handleStorageChange = (e) => {
      if (e.key === 'forceLogout') {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (loginData) => {
    const {
      employeeId: id,
      role: userRole,
      trustScore: score,
      riskLevel: risk,
      token: authToken,
      user: userData,
    } = loginData;

    setEmployeeId(id);
    setRole(userRole || 'EMPLOYEE');
    setTrustScore(score !== undefined ? score : 100);
    setRiskLevel(risk || 'LOW');
    setToken(authToken);
    setUser(userData);

    // Persist in session storage
    sessionStorage.setItem('employeeId', id);
    sessionStorage.setItem('role', userRole || 'EMPLOYEE');
    sessionStorage.setItem('trustScore', score || 100);
    sessionStorage.setItem('riskLevel', risk || 'LOW');
    sessionStorage.setItem('token', authToken || '');
    sessionStorage.setItem('user', JSON.stringify(userData || {}));
  };

  const logout = () => {
    setEmployeeId(null);
    setRole(null);
    setTrustScore(100);
    setRiskLevel('LOW');
    setUser(null);
    setToken(null);

    sessionStorage.removeItem('employeeId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('trustScore');
    sessionStorage.removeItem('riskLevel');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('portalUser');
  };

  const updateTrustScore = (newScore, newRiskLevel) => {
    setTrustScore(newScore);
    setRiskLevel(newRiskLevel);
    sessionStorage.setItem('trustScore', newScore);
    sessionStorage.setItem('riskLevel', newRiskLevel);
  };

  return (
    <AuthContext.Provider
      value={{
        employeeId,
        role,
        trustScore,
        riskLevel,
        user,
        token,
        login,
        logout,
        updateTrustScore,
        isAuthenticated: !!employeeId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
