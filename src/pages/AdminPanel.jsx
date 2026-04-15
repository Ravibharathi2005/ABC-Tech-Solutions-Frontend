import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';

const AdminPanel = () => {
  const { employeeId } = useAuth();

  useEffect(() => {
    logActivity(employeeId, "Tried Admin Access");
  }, [employeeId]);

  return (
    <div>
      <div className="page-header" style={{ color: 'var(--danger-color)' }}>
        <h1>Administrator Panel</h1>
        <p>Restricted Area - Access logged</p>
      </div>
      <div className="card" style={{ borderColor: 'var(--danger-color)' }}>
        <h3 style={{ color: 'var(--danger-color)' }}>Access Warning</h3>
        <p>You have accessed a restricted system area. This action has been centrally logged to the security operations center.</p>
      </div>
    </div>
  );
};

export default AdminPanel;
