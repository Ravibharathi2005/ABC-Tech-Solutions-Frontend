import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { logActivity } from '../utils/activityLogger';

const Navbar = () => {
  const { employeeId, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logActivity(employeeId, "LOGOUT", "User initiated manual logout");
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar" style={{ padding: '0 2rem' }}>
      <div className="user-profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '1.5rem' }}>
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'Classified Identity'}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Employee ID: {employeeId}</div>
           </div>
           <div style={{ 
             width: '40px', 
             height: '40px', 
             borderRadius: '50%', 
             background: 'var(--accent-color)', 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             color: 'white'
           }}>
              <FiUser />
           </div>
        </div>

        <div style={{ height: '30px', width: '1px', background: 'var(--border-color)', margin: '0 10px' }}></div>

        <button 
          onClick={handleLogout} 
          className="btn-logout" 
          aria-label="Logout"
          style={{ 
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
        >
          <FiLogOut /> LOGOUT
        </button>
      </div>
    </header>
  );
};

export default Navbar;
