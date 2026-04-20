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
    const pageName = location.pathname === '/' ? '/dashboard' : location.pathname;
    
    // Map paths to readable actions
    let action = `Visited ${pageName}`;
    if (pageName.includes('admin')) action = 'Admin page attempt';
    if (pageName.includes('confidential')) action = 'Restricted page attempt';
    if (pageName.includes('dashboard')) action = 'Dashboard visit';
    if (pageName.includes('profile')) action = 'Profile visit';
    if (pageName.includes('attendance')) action = 'Attendance page visit';
    if (pageName.includes('tasks')) action = 'Tasks page visit';
    if (pageName.includes('salary')) action = 'Salary page visit';

    // We don't log the login page visit itself to avoid noise, 
    // unless you want tracking there. Let's just avoid root /login noise.
    if (pageName !== '/login') {
      logActivity(null, action);
    }
  }, [location.pathname]);

  // 2. Behavioral Tracking (DOM events)
  useEffect(() => {
    // Record rapid clicks (e.g. 5 clicks within 2 seconds)
    const handleGlobalClick = () => {
      clickCount.current += 1;
      
      if (!clickTimer.current) {
        clickTimer.current = setTimeout(() => {
          if (clickCount.current >= 5) {
            logActivity(null, 'Rapid clicks detected');
          }
          clickCount.current = 0;
          clickTimer.current = null;
        }, 2000);
      }
      
      resetIdle();
    };

    // Idle detection
    const handleIdle = () => {
      logActivity(null, 'User idle time detected');
    };

    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(handleIdle, 5 * 60 * 1000); // 5 minutes idle
    };

    // Tab visibility (switch tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logActivity(null, 'Tab switch or minimized');
      } else {
        logActivity(null, 'Returned to tab');
      }
    };

    // Browser Refresh / Window Close
    const handleBeforeUnload = () => {
      logActivity(null, 'Browser refresh or close window');
    };

    // Multiple Tab Detection
    const tabId = Math.random().toString(36).substring(2, 9);
    
    const handleTabPing = (e) => {
      if (e.key === 'tabPing' && e.newValue !== tabId) {
        // Someone else pinged
        logActivity(null, 'Multiple tab usage detected');
      }
    };

    // Register active tab
    localStorage.setItem('tabPing', tabId);
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

  return null; // Silent component
};

export default ActivityMonitor;
