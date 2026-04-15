import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUser, 
  FiCheckCircle, 
  FiClock, 
  FiLock, 
  FiDollarSign, 
  FiFileText 
} from 'react-icons/fi';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        ABC Tech
      </div>
      <nav className="sidebar-nav">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1rem', marginTop: '1rem', textTransform: 'uppercase' }}>Main Nav</span>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FiUser /> Profile
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FiCheckCircle /> Tasks
        </NavLink>
        <NavLink to="/attendance" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FiClock /> Attendance
        </NavLink>
        
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1rem', marginTop: '2rem', textTransform: 'uppercase' }}>Secured</span>
        <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link danger active" : "nav-link danger"}>
          <FiLock /> Admin Panel
        </NavLink>
        <NavLink to="/salary" className={({isActive}) => isActive ? "nav-link danger active" : "nav-link danger"}>
          <FiDollarSign /> Salary Data
        </NavLink>
        <NavLink to="/confidential" className={({isActive}) => isActive ? "nav-link danger active" : "nav-link danger"}>
          <FiFileText /> Confidential Reports
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
