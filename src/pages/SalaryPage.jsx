import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { FiDollarSign, FiDownload, FiFileText, FiCheckCircle, FiLock, FiBriefcase, FiInfo } from 'react-icons/fi';
import axios from 'axios';

const SalaryPage = () => {
  const { employeeId, token } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div className="page-header" style={{ borderBottom: '2px solid var(--accent-color)', paddingBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Salary & Payroll</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <FiLock style={{ color: 'var(--accent-color)' }} /> Verified Employee Compensation Management
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <div className="card" style={{ background: 'rgba(59, 130, 246, 0.05)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }}><FiBriefcase fontSize="3rem" /></div>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>YTD Post-Tax Earnings</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-primary)' }}>${calculateYTD()}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--security-green)', fontWeight: 700, marginTop: '0.5rem' }}>+ All disbursements verified</p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payroll Interval</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Monthly</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '0.5rem' }}>Next disbursement: May 1, 2026</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Disbursement Month</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((item, idx) => (
                <tr key={idx} style={{ animation: `fadeIn 0.3s ease-out ${idx * 0.1}s both` }}>
                  <td style={{ fontWeight: 800 }}>{item.month}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>${item.basicSalary.toLocaleString()}</td>
                  <td style={{ color: 'var(--security-green)', fontWeight: 700 }}>+${item.allowances.toLocaleString()}</td>
                  <td style={{ color: 'var(--danger-color)', fontWeight: 700 }}>-${item.deductions.toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: 'var(--accent-color)', fontSize: '1.1rem' }}>${item.netSalary.toLocaleString()}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.1)', 
                      color: 'var(--security-green)' 
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => alert(`Downloading official payslip for ${item.month}...`)}
                      className="btn-primary" 
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: '0.75rem',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
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
    </div>
  );
};

export default SalaryPage;
