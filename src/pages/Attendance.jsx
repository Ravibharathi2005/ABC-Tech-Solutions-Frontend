import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';

const Attendance = () => {
  const { employeeId } = useAuth();

  useEffect(() => {
    logActivity(employeeId, "Visited Attendance");
  }, [employeeId]);

  return (
    <div>
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Logging status & session history</p>
      </div>
      <div className="card">
        <h3>Current Session</h3>
        <p>Logged in as: {employeeId}</p>
        <p>Session started: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default Attendance;
