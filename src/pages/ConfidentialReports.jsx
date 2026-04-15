import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';

const ConfidentialReports = () => {
  const { employeeId } = useAuth();

  useEffect(() => {
    logActivity(employeeId, "Viewed Confidential Reports");
  }, [employeeId]);

  return (
    <div>
      <div className="page-header" style={{ color: 'var(--danger-color)' }}>
        <h1>Confidential Reports</h1>
        <p>Restricted Area - Access logged</p>
      </div>
      <div className="card" style={{ borderColor: 'var(--danger-color)' }}>
        <h3 style={{ color: 'var(--danger-color)' }}>Access Warning</h3>
        <p>You have accessed highly sensitive company intellectual property. This access has been recorded.</p>
      </div>
    </div>
  );
};

export default ConfidentialReports;
