import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { ROLE_LABELS, ALL_ROLES } from '../utils/rbac';
import {
  FiUsers, FiShield, FiActivity, FiSettings,
  FiAlertCircle, FiCheckCircle, FiTool, FiDatabase
} from 'react-icons/fi';
import axios from 'axios';

const AdminPanel = () => {
  const { employeeId, role, token } = useAuth();
  const [activityLogs, setActivityLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    logActivity(employeeId, 'ADMIN_PANEL_ACCESS', { role, riskLevel: 'Low' });
    fetchRecentActivity();
  }, [employeeId]);

  const fetchRecentActivity = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/activity', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10 }
      });
      if (res.data?.logs) setActivityLogs(res.data.logs);
      else if (Array.isArray(res.data)) setActivityLogs(res.data.slice(0, 10));
    } catch {
      setActivityLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const ROLE_PERMISSIONS = {
    SUPER_ADMIN:      { pages: 'All Pages', tools: 'All Tools', reports: 'Full Reports', admin: 'Full Admin Control' },
    ADMIN:            { pages: 'All Pages', tools: 'All Tools', reports: 'Full Reports', admin: 'Admin Panel' },
    HR:               { pages: 'Dashboard, Profile, Leave, Salary, Attendance', tools: 'Standard Tools', reports: 'HR Reports', admin: 'No Access' },
    MANAGER:          { pages: 'Dashboard, Profile, Tasks, Attendance, Leave, Reports', tools: 'Standard Tools', reports: 'Team Reports', admin: 'No Access' },
    SECURITY_ANALYST: { pages: 'Dashboard, Profile, Confidential Reports', tools: 'Standard Tools', reports: 'Security Reports', admin: 'No Access' },
    EMPLOYEE:         { pages: 'Dashboard, Profile, Tasks, Attendance, Salary, Leave', tools: 'Standard Tools', reports: 'No Access', admin: 'No Access' },
  };

  const statCards = [
    { label: 'Total Roles',       value: ALL_ROLES.length,      icon: <FiUsers />,    color: 'var(--accent-color)' },
    { label: 'Current Role',      value: role?.replace('_',' '), icon: <FiShield />,   color: 'var(--security-green)' },
    { label: 'Protected Routes',  value: 5,                      icon: <FiSettings />, color: '#f59e0b' },
    { label: 'RBAC Engine',       value: 'Active',               icon: <FiDatabase />, color: 'var(--security-green)' },
  ];

  const tabs = [
    { key: 'overview',     label: '📊 Overview' },
    { key: 'permissions',  label: '🛡️ Permissions Matrix' },
    { key: 'activity',     label: '📋 Recent Activity' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--danger-color), #dc2626)',
            borderRadius: '14px', width: '48px', height: '48px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', boxShadow: '0 8px 20px rgba(239,68,68,0.3)'
          }}>🛡️</div>
          <h1 style={{ margin: 0 }}>Administrator Panel</h1>
          <span style={{
            background: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)',
            padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>RESTRICTED AREA</span>
        </div>
        <p>Full system administration and role-based access control management.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `${s.color}18`, color: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem',
            border: activeTab === t.key ? 'none' : '1px solid var(--border-color)',
            background: activeTab === t.key ? 'linear-gradient(135deg,var(--accent-color),#2563eb)' : 'transparent',
            color: activeTab === t.key ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'all 0.2s'
          }}>{t.label}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiShield style={{ color: 'var(--accent-color)' }} /> RBAC System Status
            </h3>
            {[
              { label: 'Route Guards',       status: 'Active',  ok: true },
              { label: 'Role Hydration',     status: 'Active',  ok: true },
              { label: 'Session Binding',    status: 'Active',  ok: true },
              { label: 'Activity Logging',   status: 'Active',  ok: true },
              { label: 'JWT Verification',   status: 'Active',  ok: true },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: item.ok ? 'var(--security-green)' : 'var(--danger-color)', fontWeight: 800, fontSize: '0.8rem' }}>
                  {item.ok ? <FiCheckCircle /> : <FiAlertCircle />} {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTool style={{ color: 'var(--accent-color)' }} /> Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'View Permissions Matrix', action: () => setActiveTab('permissions'), icon: '🛡️' },
                { label: 'View Activity Logs',      action: () => setActiveTab('activity'),    icon: '📋' },
              ].map((a, i) => (
                <button key={i} onClick={a.action} style={{
                  padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                  fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s', textAlign: 'left'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{a.icon}</span> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Permissions Matrix Tab */}
      {activeTab === 'permissions' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiShield style={{ color: 'var(--accent-color)' }} /> Role Permissions Matrix
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Accessible Pages</th>
                  <th>Tools Access</th>
                  <th>Reports Access</th>
                  <th>Admin Access</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ROLE_PERMISSIONS).map(([r, perms]) => (
                  <tr key={r}>
                    <td>
                      <span style={{
                        background: r === role ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                        color: r === role ? 'var(--accent-color)' : 'var(--text-primary)',
                        padding: '4px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem'
                      }}>
                        {r === role ? `★ ${ROLE_LABELS[r]}` : ROLE_LABELS[r] || r}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{perms.pages}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{perms.tools}</td>
                    <td>
                      <span style={{
                        color: perms.reports.includes('No') ? 'var(--danger-color)' : 'var(--security-green)',
                        fontSize: '0.82rem', fontWeight: 700
                      }}>{perms.reports}</span>
                    </td>
                    <td>
                      <span style={{
                        color: perms.admin.includes('No') ? 'var(--text-secondary)' : 'var(--security-green)',
                        fontSize: '0.82rem', fontWeight: 700
                      }}>{perms.admin}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiActivity style={{ color: 'var(--accent-color)' }} /> Recent Portal Activity
          </h3>
          {logsLoading ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading…</div>
          ) : activityLogs.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No recent activity found.</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Action</th>
                    <th>Risk</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((log, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700 }}>{log.employeeId}</td>
                      <td style={{ fontSize: '0.85rem' }}>{log.action}</td>
                      <td>
                        <span className={`badge badge-${log.riskLevel?.toLowerCase() || 'low'}`}>
                          {log.riskLevel || 'LOW'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
