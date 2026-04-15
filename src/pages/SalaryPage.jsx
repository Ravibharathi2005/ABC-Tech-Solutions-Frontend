import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';

const SalaryPage = () => {
  const { employeeId } = useAuth();

  useEffect(() => {
    logActivity(employeeId, "Viewed Salary Page");
  }, [employeeId]);

  return (
    <div>
      <div className="page-header" style={{ color: 'var(--danger-color)' }}>
        <h1>Salary Data</h1>
        <p>Restricted Area - Access logged</p>
      </div>
      <div className="card" style={{ borderColor: 'var(--danger-color)' }}>
        <h3 style={{ color: 'var(--danger-color)' }}>Access Warning</h3>
        <p>You are viewing classified financial information. Your activity is being monitored.</p>
      </div>
    </div>
  );
};

export default SalaryPage;
