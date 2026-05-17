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
import Tools from "./pages/Tools";
import RoleGuard from "./components/RoleGuard";

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

      {/* Login route — no role guard needed */}
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
        {/* Open to all authenticated roles */}
        <Route index element={<RoleGuard routeKey=""><Dashboard /></RoleGuard>} />
        <Route path="profile"    element={<RoleGuard routeKey="profile"><Profile /></RoleGuard>} />
        <Route path="tasks"      element={<RoleGuard routeKey="tasks"><Tasks /></RoleGuard>} />
        <Route path="attendance" element={<RoleGuard routeKey="attendance"><Attendance /></RoleGuard>} />
        <Route path="salary"     element={<RoleGuard routeKey="salary"><SalaryPage /></RoleGuard>} />
        <Route path="leave"      element={<RoleGuard routeKey="leave"><Leave /></RoleGuard>} />
        <Route path="tools"      element={<RoleGuard routeKey="tools"><Tools /></RoleGuard>} />

        {/* Management / HR layer — MANAGER, HR, ADMIN, SUPER_ADMIN */}
        <Route path="reports"    element={<RoleGuard routeKey="reports"><Reports /></RoleGuard>} />

        {/* Admin & Executive only — ADMIN, SUPER_ADMIN */}
        <Route path="admin"        element={<RoleGuard routeKey="admin"><AdminPanel /></RoleGuard>} />
        <Route path="confidential" element={<RoleGuard routeKey="confidential"><ConfidentialReports /></RoleGuard>} />
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