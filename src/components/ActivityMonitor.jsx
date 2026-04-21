import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { logActivity } from '../utils/activityLogger';

const ActivityMonitor = () => {
  const location = useLocation();
  const clickCount = useRef(0);
  const clickTimer = useRef(null);
  const idleTimer = useRef(null);

  // 1. Navigation Tracking
  useEffect(() => {
    const employeeId = sessionStorage.getItem('employeeId');
    const path = location.pathname;
    
    // Professional telemetry labels
    let action = `NAV_EVENT: ${path}`;
    
    if (path.includes('admin')) action = 'SYSTEM_ADMIN_ACCESS_ATTEMPT';
    if (path.includes('confidential')) action = 'RESTRICTED_DATA_ACCESS_TRIGGER';
    if (path === '/portal' || path === '/portal/') action = 'DASHBOARD_HEARTBEAT_INITIALIZED';
    if (path.includes('profile')) action = 'PROFILE_DOSSIER_VIEW';
    if (path.includes('attendance')) action = 'ATTENDANCE_LOG_SYNC';
    if (path.includes('tasks')) action = 'WORKFLOW_TASK_BOARD_VIEW';
    if (path.includes('salary')) action = 'PAYROLL_LEDGER_REVIEW';

    // Filter noise
    if (path !== '/login' && path !== '/') {
      logActivity(employeeId, action);
    }
  }, [location.pathname]);

  // 2. Behavioral Tracking (DOM events)
  useEffect(() => {
    // Record rapid clicks (High-frequency interaction)
    const handleGlobalClick = () => {
      clickCount.current += 1;
      
      if (!clickTimer.current) {
        clickTimer.current = setTimeout(() => {
          if (clickCount.current >= 8) {
            logActivity(null, 'ANOMALY: RAPID_CLICK_SEQUENCE_DETECTED');
          }
          clickCount.current = 0;
          clickTimer.current = null;
        }, 1500);
      }
      
      resetIdle();
    };

    // Idle detection - 30 seconds threshold for Zero Trust
    const handleIdle = () => {
      logActivity(null, 'IDLE_TIMEOUT: USER_INACTIVE_30S');
    };

    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(handleIdle, 30 * 1000); 
    };

    // Tab visibility (Context switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logActivity(null, 'CONTEXT_SWITCH: TAB_MINIMIZED_OR_INACTIVE');
      } else {
        logActivity(null, 'CONTEXT_RETURN: TAB_REGAINED_FOCUS');
      }
    };

    // Browser Refresh / Window Close
    const handleBeforeUnload = () => {
      logActivity(null, 'SESSION_EVENT: BROWSER_TERMINATION_OR_REFRESH');
    };

    // Multiple Tab detection
    const tabId = Math.random().toString(36).substring(2, 10);
    localStorage.setItem('portal_gate_ping', tabId);
    
    const handleTabPing = (e) => {
      if (e.key === 'portal_gate_ping' && e.newValue !== tabId) {
        logActivity(null, 'IDENTITY_ALERT: MULTIPLE_SIMULTANEOUS_SESSIONS');
      }
    };

    window.addEventListener('storage', handleTabPing);
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial idle start
    resetIdle();

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('storage', handleTabPing);
      if (clickTimer.current) clearTimeout(clickTimer.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return null;
};

export default ActivityMonitor;
