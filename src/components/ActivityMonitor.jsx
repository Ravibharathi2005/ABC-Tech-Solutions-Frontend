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
    
    let pageName = 'Unknown Page';
    
    if (path === '/portal' || path === '/portal/') pageName = 'Dashboard';
    else if (path.includes('admin')) pageName = 'Admin Panel';
    else if (path.includes('confidential')) pageName = 'Confidential Reports';
    else if (path.includes('profile')) pageName = 'Profile';
    else if (path.includes('attendance')) pageName = 'Attendance';
    else if (path.includes('tasks')) pageName = 'Tasks';
    else if (path.includes('salary')) pageName = 'Salary';
    else if (path.includes('leave')) pageName = 'Leave';
    else if (path.includes('reports')) pageName = 'Reports';

    let action = `PAGE_ACCESS: ${pageName}`;
    if (pageName === 'Unknown Page') {
      action = `NAV_EVENT: ${path}`;
    }

    // Filter noise
    if (path !== '/login' && path !== '/') {
      logActivity(employeeId, action, { pageName, path });
      
      // Broadcast to Security Website
      localStorage.setItem(
        "portalActivity",
        JSON.stringify({
          type: "PAGE_ACCESS",
          page: pageName,
          route: path,
          employeeId: employeeId,
          time: Date.now()
        })
      );
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
