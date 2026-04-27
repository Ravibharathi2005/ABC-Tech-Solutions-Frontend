import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import ActivityMonitor from "./components/ActivityMonitor";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import AdminPanel from "./pages/AdminPanel";
import SalaryPage from "./pages/SalaryPage";
import ConfidentialReports from "./pages/ConfidentialReports";
import Leave from "./pages/Leave";
import Reports from "./pages/Reports";
import SecurityWrapper from "./components/SecurityWrapper";

function AppRoutes() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hasSession = params.get("monitoringSession") === "true";

  return (
    <Routes>
      <Route element={<Outlet />}>
      {/* Root route */}
      <Route
        path="/"
        element={
          hasSession ? (
            <Navigate to="/login?monitoringSession=true" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login route */}
      <Route
        path="/login"
        element={
          <SecurityWrapper>
            <Login />
          </SecurityWrapper>
        }
      />

      {/* Protected portal routes */}
      <Route
        path="/portal"
        element={
          <SecurityWrapper>
            <Layout />
          </SecurityWrapper>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="salary" element={<SalaryPage />} />
        <Route path="leave" element={<Leave />} />
        <Route path="reports" element={<Reports />} />
        <Route path="confidential" element={<ConfidentialReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ActivityMonitor />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;