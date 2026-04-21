import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiUser,
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiActivity,
  FiLayout,
} from 'react-icons/fi';

const Sidebar = () => {
  const { role } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { to: '/portal', label: 'Dashboard', icon: FiLayout, section: 'core' },
      { to: '/portal/profile', label: 'Personal Profile', icon: FiUser, section: 'core' },
    ];

    const roleMenus = {
      SUPER_ADMIN: [
        ...commonItems,
        { to: '/portal/tasks', label: 'Task Board', icon: FiCheckSquare, section: 'core' },
        { to: '/portal/attendance', label: 'Attendance', icon: FiClock, section: 'core' },
        { to: '/portal/salary', label: 'Salary & Payroll', icon: FiDollarSign, section: 'restricted' },
        { to: '/portal/confidential', label: 'Confidential Reports', icon: FiFileText, section: 'restricted' },
      ],
      ADMIN: [
        ...commonItems,
        { to: '/portal/tasks', label: 'Task Board', icon: FiCheckSquare, section: 'core' },
        { to: '/portal/attendance', label: 'Attendance', icon: FiClock, section: 'core' },
        { to: '/portal/salary', label: 'Salary & Payroll', icon: FiDollarSign, section: 'restricted' },
        { to: '/portal/confidential', label: 'Confidential Reports', icon: FiFileText, section: 'restricted' },
      ],
      HR: [
        ...commonItems,
        { to: '/portal/attendance', label: 'Attendance', icon: FiClock, section: 'core' },
        { to: '/portal/salary', label: 'Salary & Payroll', icon: FiDollarSign, section: 'core' },
        { to: '/portal/tasks', label: 'Employee Tasks', icon: FiCheckSquare, section: 'core' },
      ],
      MANAGER: [
        ...commonItems,
        { to: '/portal/tasks', label: 'Team Tasks', icon: FiCheckSquare, section: 'core' },
        { to: '/portal/attendance', label: 'Team Attendance', icon: FiClock, section: 'core' },
      ],
      SECURITY_ANALYST: [
        ...commonItems,
        { to: '/portal/confidential', label: 'Personnel Reports', icon: FiFileText, section: 'restricted' },
      ],
      EMPLOYEE: [
        ...commonItems,
        { to: '/portal/tasks', label: 'My Tasks', icon: FiCheckSquare, section: 'core' },
        { to: '/portal/attendance', label: 'Attendance', icon: FiClock, section: 'core' },
      ],
    };

    return roleMenus[role] || commonItems;
  };

  const items = getMenuItems();
  const coreItems = items.filter(i => i.section === 'core');
  const restrictedItems = items.filter(i => i.section === 'restricted');

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ flexDirection: 'column', height: '140px', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
           <FiGrid style={{ color: 'var(--accent-color)', fontSize: '1.8rem' }} />
           <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>PORTAL</span>
        </div>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: 800, 
          background: 'rgba(59, 130, 246, 0.1)', 
          color: 'var(--accent-color)', 
          padding: '4px 12px', 
          borderRadius: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {role?.replace('_', ' ') || 'EMPLOYEE'}
        </div>
      </div>

      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', padding: '1.5rem 1rem 1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
           Navigation
        </div>
        
        {coreItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <item.icon /> {item.label}
          </NavLink>
        ))}

        {restrictedItems.length > 0 && (
          <>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', padding: '2.5rem 1rem 1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
               Management
            </div>
            {restrictedItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <item.icon /> {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div style={{ padding: '2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--security-green)' }}></div>
            SECURE SESSION ACTIVE
         </div>
         SYSTEM v4.2.0
      </div>
    </aside>
  );
};

export default Sidebar;
