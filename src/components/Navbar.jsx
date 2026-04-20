import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { logActivity } from '../utils/activityLogger';

const Navbar = () => {
  const { employeeId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logActivity(employeeId, "Logout");
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="user-profile">
        <div className="user-id">Active User: {employeeId}</div>
        <button onClick={handleLogout} className="btn-logout" aria-label="Logout">
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
