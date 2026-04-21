import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { FiClock, FiCheckCircle, FiLogIn, FiLogOut, FiActivity, FiMapPin, FiCalendar } from 'react-icons/fi';
import axios from 'axios';

const Attendance = () => {
  const { employeeId, token } = useAuth();
  const [history, setHistory] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    logActivity(employeeId, "ATTENDANCE_VIEW", "Viewing attendance history");
    fetchHistory();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
      setLoading(false);
    };
  }, [employeeId]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
      
      const today = new Date().toISOString().split('T')[0];
      const todaySession = res.data.find(s => s.date === today);
      setCurrentSession(todaySession);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    }
  };

  const handleAttendance = async (type) => {
    setLoading(true);
    try {
      const endpoint = type === 'IN' ? 'check-in' : 'check-out';
      await axios.post(`http://localhost:8080/api/attendance/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      logActivity(employeeId, `PUNCH_${type}`, `Employee clocked ${type.toLowerCase()}`);
      fetchHistory();
    } catch (err) {
      console.error("Attendance action error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div className="page-header">
        <h1>Attendance Logging</h1>
        <p>Record your work hours and maintain presence logs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
        {/* Punch Card */}
        <div className="card" style={{ height: 'fit-content', borderTop: '4px solid var(--accent-color)' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiClock style={{ color: 'var(--accent-color)' }} /> Current Session
          </h3>
          
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--text-primary)' }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600, margin: '1rem 0 2.5rem' }}>
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
              {currentSession ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Shift Start:</span>
                    <span style={{ fontWeight: 700 }}>{new Date(currentSession.checkIn).toLocaleTimeString()}</span>
                  </div>
                  {currentSession.checkOut ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Shift End:</span>
                      <span style={{ fontWeight: 700 }}>{new Date(currentSession.checkOut).toLocaleTimeString()}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--security-green)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FiActivity /> CLOCKED IN
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ongoing shift...</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>You are not currently clocked in.</div>
              )}
            </div>

            {!currentSession ? (
              <button 
                onClick={() => handleAttendance('IN')}
                disabled={loading}
                className="btn-primary" 
                style={{ width: '100%', padding: '1.25rem', borderRadius: '12px' }}
              >
                <FiLogIn /> CLOCK IN
              </button>
            ) : !currentSession.checkOut ? (
              <button 
                onClick={() => handleAttendance('OUT')}
                disabled={loading}
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--danger-color), #dc2626)',
                  boxShadow: '0 8px 16px rgba(239, 68, 68, 0.15)'
                }}
              >
                <FiLogOut /> CLOCK OUT
              </button>
            ) : (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                color: 'var(--security-green)', 
                padding: '1.25rem', 
                borderRadius: '12px',
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px' 
              }}>
                <FiCheckCircle fontSize="1.3rem" /> SHIFT COMPLETE
              </div>
            )}
          </div>
        </div>

        {/* Global Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiCalendar style={{ color: 'var(--accent-color)' }} /> Recent Logs
            </h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{row.date}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}</td>
                      <td style={{ fontWeight: 700 }}>{row.workHours ? `${row.workHours}h` : '--'}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: 800,
                          background: row.status === 'PRESENT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: row.status === 'PRESENT' ? 'var(--security-green)' : 'var(--danger-color)'
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                     <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No attendance records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
