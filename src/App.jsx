import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';
import AdminPanel from './pages/AdminPanel';
import SalaryPage from './pages/SalaryPage';
import ConfidentialReports from './pages/ConfidentialReports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="salary" element={<SalaryPage />} />
            <Route path="confidential" element={<ConfidentialReports />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
