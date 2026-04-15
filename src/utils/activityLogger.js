import axios from 'axios';

const API_URL = 'http://localhost:8080/api/activity';

export const logActivity = async (employeeId, action) => {
  if (!employeeId) return; // Silent return if no user is signed in yet

  try {
    await axios.post(API_URL, {
      employeeId,
      action
    });
    console.log(`[Activity Logged] User: ${employeeId} | Action: ${action}`);
  } catch (error) {
    console.warn('Failed to log activity. Target backend may not be running.', error.message);
  }
};
