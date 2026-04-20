import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';

const Dashboard = () => {
  const { employeeId, role, trustScore, riskLevel, user } = useAuth();
  const [dashboardContent, setDashboardContent] = useState(null);

  useEffect(() => {
    logActivity(employeeId, "Dashboard", "User visited dashboard");
  }, [employeeId]);

  // Role-based dashboard content
  useEffect(() => {
    const getRoleDashboard = () => {
      switch (role) {
        case 'SUPER_ADMIN':
          return {
            title: 'Super Admin Dashboard',
            subtitle: 'System-wide control and monitoring',
            sections: [
              { title: 'System Health', icon: '⚙️', content: 'All systems operational' },
              { title: 'User Management', icon: '👥', content: 'Manage all users and roles' },
              { title: 'Security Alerts', icon: '🚨', content: 'View critical security events' },
              { title: 'Audit Logs', icon: '📋', content: 'Complete activity audit trail' },
            ],
          };
        case 'ADMIN':
          return {
            title: 'Admin Dashboard',
            subtitle: 'Administrative controls',
            sections: [
              { title: 'User Activity', icon: '📊', content: 'Monitor team activity' },
              { title: 'System Status', icon: '⚙️', content: 'System health status' },
              { title: 'Access Control', icon: '🔐', content: 'Manage access policies' },
              { title: 'Reports', icon: '📈', content: 'Generate reports' },
            ],
          };
        case 'HR':
          return {
            title: 'HR Dashboard',
            subtitle: 'Employee management',
            sections: [
              { title: 'Employee Records', icon: '👤', content: 'Manage employee data' },
              { title: 'Attendance', icon: '📅', content: 'Track attendance' },
              { title: 'Payroll', icon: '💰', content: 'Payroll management' },
              { title: 'Requests', icon: '📝', content: 'Employee requests' },
            ],
          };
        case 'MANAGER':
          return {
            title: 'Manager Dashboard',
            subtitle: 'Team oversight',
            sections: [
              { title: 'Team Performance', icon: '📊', content: 'Team metrics' },
              { title: 'Task Tracking', icon: '✅', content: 'Track team tasks' },
              { title: 'Reports', icon: '📄', content: 'Generate reports' },
              { title: 'Team Activity', icon: '👥', content: 'View team updates' },
            ],
          };
        case 'SECURITY_ANALYST':
          return {
            title: 'Security Dashboard',
            subtitle: 'Security monitoring',
            sections: [
              { title: 'Threat Analysis', icon: '🔍', content: 'Monitor threats' },
              { title: 'Access Logs', icon: '🔐', content: 'Review access logs' },
              { title: 'Incidents', icon: '🚨', content: 'Investigate incidents' },
              { title: 'Compliance', icon: '✓', content: 'Compliance status' },
            ],
          };
        default: // EMPLOYEE
          return {
            title: 'Employee Portal',
            subtitle: 'Your dashboard',
            sections: [
              { title: 'My Profile', icon: '👤', content: 'View your profile' },
              { title: 'Attendance', icon: '📅', content: 'Your attendance records' },
              { title: 'Tasks', icon: '✅', content: 'Your assigned tasks' },
              { title: 'Updates', icon: '📢', content: 'Latest updates' },
            ],
          };
      }
    };

    setDashboardContent(getRoleDashboard());
  }, [role]);

  // Get risk level color
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return '#d32f2f'; // Red
      case 'HIGH':
        return '#f57c00'; // Orange
      case 'MEDIUM':
        return '#fbc02d'; // Yellow
      case 'LOW':
      default:
        return '#388e3c'; // Green
    }
  };

  // Get trust score color
  const getTrustColor = () => {
    if (trustScore >= 80) return '#388e3c'; // Green
    if (trustScore >= 50) return '#fbc02d'; // Yellow
    if (trustScore >= 20) return '#f57c00'; // Orange
    return '#d32f2f'; // Red
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>{dashboardContent?.title || 'Dashboard'}</h1>
            <p>{dashboardContent?.subtitle || 'Welcome back'} • {user?.name || employeeId}</p>
          </div>

          {/* Trust Score Badge */}
          <div
            style={{
              background: getTrustColor(),
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '120px',
            }}
          >
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Trust Score</span>
            <span style={{ fontSize: '1.8rem', marginTop: '4px' }}>{trustScore}</span>
            <span style={{ fontSize: '0.8rem', marginTop: '2px' }}>Risk: {riskLevel}</span>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div style={{ marginBottom: '20px' }}>
        <span
          style={{
            background: '#e3f2fd',
            color: '#1565c0',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          📌 Role: {role}
        </span>
      </div>

      {/* Role-Based Content Grid */}
      <div className="card-grid">
        {dashboardContent?.sections.map((section, idx) => (
          <div key={idx} className="card">
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
              {section.icon}
            </div>
            <h3>{section.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      {riskLevel !== 'LOW' && (
        <div
          style={{
            background: getRiskColor(),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            marginTop: '20px',
            fontWeight: '500',
          }}
        >
          ⚠️ Your trust score is {riskLevel}. Please review your account activity.
        </div>
      )}

      {/* Standard Info Cards */}
      <div className="card-grid" style={{ marginTop: '20px' }}>
        <div className="card">
          <h3>Recent Updates</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ensure all security guidelines are followed carefully. Your activity on this network is monitored.
          </p>
        </div>
        <div className="card">
          <h3>System Status</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            All systems operational. Network security is optimal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
