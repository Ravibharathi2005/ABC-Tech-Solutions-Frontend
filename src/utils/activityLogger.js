import axios from 'axios';

const API_URL = 'http://localhost:8080/api/activity';

const getBrowserTelemetry = () => {
  return {
    browser: navigator.userAgent,
    operatingSystem: navigator.platform,
    deviceType: /Mobile|Android|iP(ad|hone)/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

const deriveRiskLevel = (action) => {
  const lowerAction = action.toLowerCase();
  
  if (
    lowerAction.includes('admin') || 
    lowerAction.includes('restricted') || 
    lowerAction.includes('failed') || 
    lowerAction.includes('unauthorized')
  ) {
    return 'High';
  }
  
  if (
    lowerAction.includes('rapid') || 
    lowerAction.includes('idle') || 
    lowerAction.includes('refresh') || 
    lowerAction.includes('multiple tab') ||
    lowerAction.includes('unusual')
  ) {
    return 'Medium';
  }
  
  return 'Low';
};

export const logActivity = async (employeeId, action, additionalData = {}) => {
  const idToSend = employeeId || sessionStorage.getItem('employeeId') || sessionStorage.getItem('portalUser') || 'UNKNOWN';

  const telemetry = getBrowserTelemetry();
  const riskLevel = additionalData.riskLevel || deriveRiskLevel(action);
  const currentPage = window.location.pathname + window.location.search;
  
  const payload = {
    employeeId: idToSend,
    employeeName: additionalData.employeeName || 'Unknown',
    action,
    currentPage,
    timestamp: new Date().toISOString(),
    ...telemetry,
    riskLevel,
    ...additionalData
  };

  try {
    await axios.post(API_URL, payload);
    console.log(`[Activity Logged] User: ${idToSend} | Risk: ${riskLevel} | Action: ${action}`);
  } catch (error) {
    console.warn('Failed to log activity. Target backend may not be running.', error.message);
  }
};
