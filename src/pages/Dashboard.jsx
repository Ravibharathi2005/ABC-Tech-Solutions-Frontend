import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiCalendar, FiCheckCircle, 
  FiArrowRight, FiBell, FiClock, FiFileText,
  FiTrello, FiActivity, FiUsers, FiShield
} from 'react-icons/fi';

const Dashboard = () => {
  const { employeeId, role, user, token } = useAuth();
  const navigate = useNavigate();
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

  const trustScore = user?.riskScore !== undefined ? (100 - user.riskScore) : 95;

  const quickActions = [
    { label: 'Mark Attendance', icon: <FiClock />, onClick: () => navigate('/portal/attendance') },
    { label: 'View Tasks', icon: <FiTrello />, onClick: () => navigate('/portal/tasks') },
    { label: 'Apply Leave', icon: <FiCalendar />, onClick: () => navigate('/portal/leave') },
    { label: 'Update Profile', icon: <FiUser />, onClick: () => navigate('/portal/profile') }
  ];

  return (
    <div className="page-container">
      {/* Welcome Section */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Welcome back, {user?.name?.split(' ')[0] || 'Employee'}!</h1>
            <span style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--accent-color)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {role ? role.replace('_', ' ') : 'EMPLOYEE'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Employee ID: {employeeId} • {user?.department || 'Operations'}
          </p>
        </div>

        <div style={{ textAlign: 'right', background: 'var(--card-bg)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Trust Score Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div style={{ 
            background: 'var(--security-green)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
          }}>
            <FiShield />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Trust Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--security-green)' }}>{trustScore}%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status: {trustScore >= 90 ? 'Excellent' : 'Good'}</div>
          </div>
        </div>

        {/* Dynamic Status Banner */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderLeft: `4px solid ${stats.isClockedIn ? 'var(--security-green)' : 'var(--accent-color)'}` }}>
          <div style={{ 
            background: stats.isClockedIn ? 'var(--security-green)' : 'var(--accent-color)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
          }}>
            {stats.isClockedIn ? <FiClock /> : <FiUser />}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Attendance Status</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {stats.isClockedIn ? 'Session Active' : 'Action Required'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {stats.isClockedIn ? 'Your presence is recorded.' : 'Please clock in for today.'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem', alignItems: 'start' }}>
        {/* Quick Actions */}
        <div className="card" style={{ padding: '1.5rem' }}>
           <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Quick Actions</h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {quickActions.map((action, idx) => (
                <button key={idx} onClick={action.onClick} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s ease'
                }} className="hover-lift">
                  <div style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>{action.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{action.label}</div>
                </button>
              ))}
           </div>
        </div>

        {/* Notifications Panel */}
        <div className="card" style={{ padding: '1.5rem' }}>
           <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <FiBell /> Notifications
           </h2>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent-color)' }}>
                 <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>System Update</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Portal maintenance scheduled for this weekend.</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', borderLeft: '3px solid var(--security-green)' }}>
                 <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>Payroll Processed</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your salary for this month has been credited.</div>
              </div>
           </div>
        </div>
      </div>

      {/* Real-Time Productivity Section */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiActivity style={{ color: 'var(--security-green)' }} /> Performance & Recent Activity
        </h2>
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

      <style>{`
        .hover-lift:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: var(--accent-color) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
           .page-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
