import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';

const Dashboard = () => {
  const { employeeId } = useAuth();

  useEffect(() => {
    logActivity(employeeId, "Visited Dashboard");
  }, [employeeId]);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {employeeId}</p>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Recent Updates</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ensure all security guidelines are followed carefully. Your activity on this network is monitored.
          </p>
        </div>
        <div className="card">
          <h3>System Status</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            All systems operational.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
