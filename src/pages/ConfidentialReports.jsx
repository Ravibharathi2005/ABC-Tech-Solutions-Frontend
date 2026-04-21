import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { FiLock, FiAlertCircle, FiFileText, FiShield, FiFile } from 'react-icons/fi';

const ConfidentialReports = () => {
  const { employeeId, role } = useAuth();
  const [accessDenied, setAccessDenied] = useState(false);

  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  useEffect(() => {
    if (!isAdmin) {
      setAccessDenied(true);
      logActivity(employeeId, "UNAUTHORIZED_ACCESS_ATTEMPT", "User attempted to access restricted reports module");
    } else {
      logActivity(employeeId, "CONFIDENTIAL_REPORTS_VIEW", "Admin accessing sensitive internal documents");
    }
  }, [employeeId, isAdmin]);

  if (accessDenied) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ maxWidth: '480px', textAlign: 'center', padding: '4rem 3rem', borderTop: '4px solid var(--danger-color)' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '50%',
            margin: '0 auto 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--danger-color)'
          }}>
            <FiLock fontSize="2.5rem" />
          </div>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Unauthorized Access</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            You do not have the necessary permissions to view confidential corporate reports. This area is reserved for **Administration** and **Executive Management** only.
          </p>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '1.25rem', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textAlign: 'left'
          }}>
            <FiAlertCircle style={{ color: 'var(--danger-color)', fontSize: '1.25rem', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              This attempt has been logged for internal review. Please contact your supervisor for access requests.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div className="page-header">
        <h1>Confidential Reports</h1>
        <p>Restricted access repository for sensitive corporate documentation and strategy.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {[
          { name: 'Financial Projections Q4.pdf', date: '2026-04-15', size: '2.4MB' },
          { name: 'HR Reorganization Strategy.docx', date: '2026-04-10', size: '1.1MB' },
          { name: 'Confidential Client List 2026.xlsx', date: '2026-04-02', size: '540KB' },
          { name: 'Internal Security Audit.pdf', date: '2026-03-28', size: '3.8MB' }
        ].map((doc, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent-color)',
              fontSize: '1.5rem'
            }}>
              <FiFileText />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{doc.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.size} • Modified {doc.date}</div>
            </div>
            <FiShield style={{ color: 'var(--security-green)', opacity: 0.5 }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
         <h4 style={{ color: 'var(--danger-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiShield /> Restricted Environment Warning
         </h4>
         <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            You are currently accessing a restricted repository. All downloads, views, and interactions are strictly monitored and logged. Personnel are required to follow internal confidentiality protocols at all times.
         </p>
      </div>
    </div>
  );
};

export default ConfidentialReports;
