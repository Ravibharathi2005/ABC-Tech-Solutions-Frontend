import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import axios from 'axios';
import { 
  FiUser, FiCalendar, FiCheckCircle, 
  FiArrowRight, FiBell, FiClock, FiFileText,
  FiTrello, FiActivity, FiUsers
} from 'react-icons/fi';

const Dashboard = () => {
  const { employeeId, role, user, token } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    pendingTasks: 0,
    completedTasks: 0,
    taskAccuracy: 0,
    attendanceStreak: 0,
    isClockedIn: false,
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/user/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && token) {
      fetchStats();
      logActivity(employeeId, "DASHBOARD_ACCESS", "User accessed real-time portal metrics");
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [employeeId, token]);

  const getDashboardModules = () => {
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    
    if (isAdmin) {
      return [
        { title: 'Workforce Status', icon: <FiUsers />, content: `${stats.totalEmployees} employees active in registry` },
        { title: 'Pending Actions', icon: <FiTrello />, content: `${stats.pendingTasks} tasks requiring oversight` },
        { title: 'Operational Log', icon: <FiFileText />, content: 'Centralized record syncing stable' },
        { title: 'Notifications', icon: <FiBell />, content: '3 department alerts pending' },
      ];
    }

    return [
      { title: 'My Profile', icon: <FiUser />, content: 'View verified personnel details' },
      { title: 'Attendance', icon: <FiCalendar />, content: stats.isClockedIn ? 'Your shift is currently active' : 'Clock-in required for today' },
      { title: 'My Tasks', icon: <FiTrello />, content: `${stats.pendingTasks} assignments pending completion` },
      { title: 'Announcements', icon: <FiBell />, content: '2 organization updates available' },
    ];
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Welcome, {user?.name.split(' ')[0] || 'Employee'}</h1>
          <p>Employee ID: {employeeId} • {user?.department || 'Operations'}</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {currentTime.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Dynamic Status Banner */}
      <div style={{
        background: stats.isClockedIn ? 'rgba(16, 185, 129, 0.05)' : 'rgba(59, 130, 246, 0.05)',
        borderLeft: `4px solid ${stats.isClockedIn ? 'var(--security-green)' : 'var(--accent-color)'}`,
        padding: '1.25rem 2rem',
        borderRadius: '8px',
        marginBottom: '3.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ 
          background: stats.isClockedIn ? 'var(--security-green)' : 'var(--accent-color)', 
          color: 'white', 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {stats.isClockedIn ? <FiClock /> : <FiBell />}
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
            {stats.isClockedIn ? 'Session Active' : 'Attendance Requirement'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {stats.isClockedIn 
              ? 'Your presence is recorded. Remember to clock out at the end of your shift.' 
              : 'You have not yet clocked in for today. Please visit the Attendance tab.'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {getDashboardModules().map((module, idx) => (
          <div key={idx} className="card dashboard-module" style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both` }}>
            <div style={{ 
              fontSize: '1.4rem', 
              color: 'var(--accent-color)', 
              background: 'rgba(59, 130, 246, 0.05)',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              marginBottom: '1.25rem'
            }}>
              {module.icon}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{module.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{module.content}</p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: 'var(--accent-color)', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              Sync Details <FiArrowRight />
            </div>
          </div>
        ))}
      </div>

      {/* Real-Time Productivity Section */}
      <div style={{ marginTop: '4rem' }}>
         <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiActivity style={{ color: 'var(--security-green)' }} /> Live Productivity Metrics
         </h2>
         <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Attendance Logged</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.attendanceStreak} Days</div>
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Task Accuracy</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--security-green)' }}>{stats.taskAccuracy}%</div>
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Pending Tasks</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stats.pendingTasks > 3 ? 'var(--danger-color)' : 'var(--text-primary)' }}>{stats.pendingTasks ?? 0}</div>
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Project Status</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-color)' }}>{stats.taskAccuracy >= 90 ? 'Ahead' : 'On Track'}</div>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .dashboard-module:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--accent-color);
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
