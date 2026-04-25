import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { FiDollarSign, FiDownload, FiFileText, FiCheckCircle, FiLock, FiBriefcase, FiInfo, FiGift, FiShield, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';

const SalaryPage = () => {
  const { employeeId, token } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    logActivity(employeeId, "PAYROLL_REVIEW", "Reviewing personal salary and disbursement history");
    fetchSalaries();
  }, [employeeId]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/salary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.length === 0) {
        await axios.post('http://localhost:8080/api/salary/seed', {}, {
           headers: { Authorization: `Bearer ${token}` }
        });
        const reFetch = await axios.get('http://localhost:8080/api/salary', {
           headers: { Authorization: `Bearer ${token}` }
        });
        setSalaries(reFetch.data);
      } else {
        setSalaries(res.data);
      }
    } catch (err) {
      console.error("Salary fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateYTD = () => {
    return salaries.reduce((acc, curr) => acc + curr.netSalary, 0).toLocaleString();
  };

  const handleDownload = (month) => {
    setToastMessage(`Downloading official payslip for ${month}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div className="page-header" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Salary & Payroll</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <FiLock style={{ color: 'var(--accent-color)' }} /> Verified Employee Compensation Management
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <div className="card summary-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.15, color: 'var(--accent-color)' }}><FiBriefcase fontSize="3.5rem" /></div>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>YTD Post-Tax Earnings</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--accent-color)' }}>${calculateYTD()}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--security-green)', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiCheckCircle /> All disbursements verified
          </p>
        </div>

        <div className="card summary-card" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.05 }}><FiTrendingUp fontSize="3.5rem" /></div>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payroll Interval</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-primary)' }}>Monthly</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '0.5rem' }}>Next disbursement: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}</p>
        </div>

        <div className="card summary-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.15, color: 'var(--security-green)' }}><FiGift fontSize="3.5rem" /></div>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Benefits</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><FiShield style={{ color: 'var(--accent-color)' }} /> Health Insurance Active</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><FiDollarSign style={{ color: 'var(--security-green)' }} /> 401(k) Matching 5%</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><FiTrendingUp style={{ color: '#f59e0b' }} /> Performance Bonus Eligible</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <FiFileText style={{ color: 'var(--accent-color)' }} /> Salary Breakdown History
        </h3>
        <div className="table-container card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Disbursement Month</th>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Basic Salary</th>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Allowances</th>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Deductions</th>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Net Salary</th>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((item, idx) => (
                <tr key={idx} className="table-row" style={{ animation: `fadeIn 0.3s ease-out ${idx * 0.1}s both`, borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1.25rem', fontWeight: 800 }}>{item.month}</td>
                  <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>${item.basicSalary.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem', color: 'var(--security-green)', fontWeight: 700 }}>+${item.allowances.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem', color: 'var(--danger-color)', fontWeight: 700 }}>-${item.deductions.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem', fontWeight: 900, color: 'var(--accent-color)', fontSize: '1.1rem' }}>${item.netSalary.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.1)', 
                      color: 'var(--security-green)' 
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDownload(item.month)}
                      className="btn-outline download-btn" 
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: '0.75rem',
                        background: 'transparent',
                        border: '1px solid var(--accent-color)',
                        color: 'var(--accent-color)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <FiDownload /> DOWNLOAD
                    </button>
                  </td>
                </tr>
              ))}
              {salaries.length === 0 && !loading && (
                 <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                       <FiFileText style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.1 }} /> <br />
                       No historical payroll records found for this account.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ 
          marginTop: '4rem', 
          padding: '2rem', 
          background: 'rgba(59, 130, 246, 0.05)', 
          borderRadius: '16px', 
          border: '1px solid rgba(59, 130, 246, 0.1)', 
          display: 'flex', 
          gap: '1.5rem', 
          alignItems: 'center'
        }}>
           <div style={{ 
             background: 'var(--accent-color)', 
             width: '48px', 
             height: '48px', 
             borderRadius: '12px', 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center', 
             color: 'white', 
             flexShrink: 0 
           }}>
              <FiInfo fontSize="1.5rem" />
           </div>
           <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Information Security Notice</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Financial records are highly sensitive. Please ensure you are viewing this information in a private environment. Downloaded payslips are password-protected using your corporate credentials.
              </p>
           </div>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div style={{
           position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--accent-color)', color: 'white', padding: '1rem 1.5rem', borderRadius: '8px', fontWeight: 700, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideUp 0.3s ease-out', zIndex: 1000
        }}>
          <FiCheckCircle fontSize="1.2rem" />
          {toastMessage}
        </div>
      )}

      <style>{`
         .table-row:hover {
            background: rgba(255, 255, 255, 0.02);
         }
         .download-btn:hover {
            background: var(--accent-color) !important;
            color: white !important;
         }
         @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
         }
      `}</style>
    </div>
  );
};

export default SalaryPage;
