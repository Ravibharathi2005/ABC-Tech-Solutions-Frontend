import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiDollarSign,
  FiFileText,
  FiSettings,
  FiShield,
  FiAlertCircle,
} from 'react-icons/fi';

const Sidebar = () => {
  const { role } = useAuth();

  // Define menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { to: '/', label: 'Dashboard', icon: FiHome, section: 'main' },
      { to: '/profile', label: 'Profile', icon: FiUser, section: 'main' },
    ];

    const roleMenus = {
      SUPER_ADMIN: [
        ...commonItems,
        { to: '/admin', label: 'User Management', icon: FiSettings, section: 'admin' },
        { to: '/admin', label: 'System Settings', icon: FiLock, section: 'admin' },
        { to: '/admin', label: 'Audit Logs', icon: FiFileText, section: 'admin' },
        { to: '/admin', label: 'Security Alerts', icon: FiAlertCircle, section: 'admin' },
        { to: '/salary', label: 'Salary Data', icon: FiDollarSign, section: 'secured' },
        { to: '/confidential', label: 'Confidential Reports', icon: FiFileText, section: 'secured' },
      ],
      ADMIN: [
        ...commonItems,
        { to: '/tasks', label: 'Tasks', icon: FiCheckCircle, section: 'main' },
        { to: '/attendance', label: 'Attendance', icon: FiClock, section: 'main' },
        { to: '/admin', label: 'Admin Panel', icon: FiLock, section: 'admin' },
        { to: '/salary', label: 'Salary Data', icon: FiDollarSign, section: 'secured' },
      ],
      HR: [
        ...commonItems,
        { to: '/attendance', label: 'Attendance', icon: FiClock, section: 'main' },
        { to: '/salary', label: 'Salary Data', icon: FiDollarSign, section: 'main' },
        { to: '/tasks', label: 'Employee Requests', icon: FiCheckCircle, section: 'main' },
      ],
      MANAGER: [
        ...commonItems,
        { to: '/tasks', label: 'Tasks', icon: FiCheckCircle, section: 'main' },
        { to: '/attendance', label: 'Team Attendance', icon: FiClock, section: 'main' },
      ],
      SECURITY_ANALYST: [
        ...commonItems,
        { to: '/admin', label: 'Security Monitoring', icon: FiShield, section: 'admin' },
        { to: '/admin', label: 'Alerts', icon: FiAlertCircle, section: 'admin' },
      ],
      EMPLOYEE: [
        ...commonItems,
        { to: '/tasks', label: 'Tasks', icon: FiCheckCircle, section: 'main' },
        { to: '/attendance', label: 'Attendance', icon: FiClock, section: 'main' },
      ],
    };

    return roleMenus[role] || commonItems;
  };

  const menuItems = getMenuItems();
  const mainItems = menuItems.filter(item => item.section === 'main');
  const securedItems = menuItems.filter(item => item.section === 'admin' || item.section === 'secured');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        ABC Tech
        <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>
          Role: {role}
        </div>
      </div>
      <nav className="sidebar-nav">
        {/* Main Navigation */}
        {mainItems.length > 0 && (
          <>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                paddingLeft: '1rem',
                marginTop: '1rem',
                textTransform: 'uppercase',
              }}
            >
              Main Nav
            </span>
            {mainItems.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  <IconComponent /> {item.label}
                </NavLink>
              );
            })}
          </>
        )}

        {/* Secured/Admin Section */}
        {securedItems.length > 0 && (
          <>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                paddingLeft: '1rem',
                marginTop: '2rem',
                textTransform: 'uppercase',
              }}
            >
              Secured
            </span>
            {securedItems.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'nav-link danger active' : 'nav-link danger'
                  }
                >
                  <IconComponent /> {item.label}
                </NavLink>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
