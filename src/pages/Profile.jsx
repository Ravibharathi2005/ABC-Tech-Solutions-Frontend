import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';

const Profile = () => {
  const { employeeId } = useAuth();

  useEffect(() => {
    logActivity(employeeId, "Opened Profile");
  }, [employeeId]);

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your personnel file</p>
      </div>
      <div className="card" style={{ maxWidth: '600px' }}>
        <p><strong>Employee ID:</strong> {employeeId}</p>
        <p><strong>Status:</strong> Active</p>
      </div>
    </div>
  );
};

export default Profile;
