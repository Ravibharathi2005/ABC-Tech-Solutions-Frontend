import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { employeeId } = useAuth();

  if (!employeeId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
