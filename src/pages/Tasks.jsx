import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';

const Tasks = () => {
  const { employeeId } = useAuth();

  useEffect(() => {
    logActivity(employeeId, "Visited Tasks");
  }, [employeeId]);

  return (
    <div>
      <div className="page-header">
        <h1>Assigned Tasks</h1>
        <p>Current active objectives</p>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TSK-001</td>
              <td>Review Q3 Security Guidelines</td>
              <td>Pending</td>
            </tr>
            <tr>
              <td>TSK-002</td>
              <td>Update Access Credentials</td>
              <td>Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
