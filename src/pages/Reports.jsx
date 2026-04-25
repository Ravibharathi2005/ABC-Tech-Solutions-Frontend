import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiDownload, FiFileText, FiClock, FiDollarSign, FiShield, FiFilter, FiBarChart2 } from 'react-icons/fi';

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('ATTENDANCE');
  const [dateRange, setDateRange] = useState('This Month');
  const [toastMessage, setToastMessage] = useState(null);

  const riskScore = user?.riskScore !== undefined ? user.riskScore : 5;
  const trustScore = 100 - riskScore;

  const handleExport = () => {
    setToastMessage(`Exporting ${reportType} report for ${dateRange}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const ReportCard = ({ title, icon, color, active, onClick }) => (
    <div onClick={onClick} className="card" style={{ 
       cursor: 'pointer',
       borderTop: `4px solid ${color}`,
       border: active ? `2px solid ${color}` : '',
       opacity: active ? 1 : 0.7,
       display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem',
       transition: 'all 0.2s',
       transform: active ? 'translateY(-4px)' : 'none',
       boxShadow: active ? `0 10px 20px ${color}20` : 'none'
    }}>
      <div style={{ background: `${color}15`, color: color, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
         {icon}
      </div>
      <div>
         <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{title}</h3>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Analytics & Reports</h1>
          <p>Generate and export operational insights.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600 }}>
             <option>This Week</option>
             <option>This Month</option>
             <option>Last Quarter</option>
             <option>This Year</option>
          </select>
          <button onClick={handleExport} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
            <FiDownload /> EXPORT
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
         <ReportCard title="Attendance Report" icon={<FiClock />} color="var(--accent-color)" active={reportType === 'ATTENDANCE'} onClick={() => setReportType('ATTENDANCE')} />
         <ReportCard title="Salary & Payroll" icon={<FiDollarSign />} color="var(--security-green)" active={reportType === 'SALARY'} onClick={() => setReportType('SALARY')} />
         <ReportCard title="Risk & Trust Summary" icon={<FiShield />} color="#f59e0b" active={reportType === 'RISK'} onClick={() => setReportType('RISK')} />
      </div>

      <div className="card" style={{ padding: '2rem', minHeight: '400px' }}>
         {reportType === 'ATTENDANCE' && (
           <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-color)' }}>
                <FiClock /> Attendance Summary: {dateRange}
             </h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Present</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-color)' }}>21 Days</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Absent</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger-color)' }}>1 Day</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Late Arrivals</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>3 Times</div>
                </div>
             </div>
             
             <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '2rem', borderRadius: '12px', border: '1px dashed var(--accent-color)', textAlign: 'center' }}>
                <FiBarChart2 style={{ fontSize: '3rem', color: 'var(--accent-color)', opacity: 0.5, marginBottom: '1rem' }} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>Detailed graphical timeline will be rendered here.</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Data fetch from attendance API successful.</p>
             </div>
           </div>
         )}

         {reportType === 'SALARY' && (
           <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--security-green)' }}>
                <FiDollarSign /> Payroll Disbursement: {dateRange}
             </h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Disbursed</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--security-green)' }}>$12,450</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Taxes Paid</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>$2,890</div>
                </div>
             </div>
             <div className="table-container">
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                 <thead><tr><th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Month</th><th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Amount</th><th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Status</th></tr></thead>
                 <tbody>
                    <tr><td style={{ padding: '1rem' }}>April 2026</td><td style={{ padding: '1rem', fontWeight: 700 }}>$6,225</td><td style={{ padding: '1rem', color: 'var(--security-green)', fontWeight: 800 }}>CLEARED</td></tr>
                    <tr><td style={{ padding: '1rem' }}>March 2026</td><td style={{ padding: '1rem', fontWeight: 700 }}>$6,225</td><td style={{ padding: '1rem', color: 'var(--security-green)', fontWeight: 800 }}>CLEARED</td></tr>
                 </tbody>
               </table>
             </div>
           </div>
         )}

         {reportType === 'RISK' && (
           <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b' }}>
                <FiShield /> Risk Profiling Summary: {dateRange}
             </h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Trust Score Average</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800, color: trustScore >= 90 ? 'var(--security-green)' : '#f59e0b' }}>{trustScore}%</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Anomalies Detected</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>0</div>
                </div>
             </div>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Your behavioral patterns indicate normal corporate activity. No access violations or suspicious logins detected over the selected period. AI telemetry modeling consistently ranks your usage within acceptable safe bounds.
             </p>
           </div>
         )}
      </div>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div style={{
           position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--accent-color)', color: 'white', padding: '1rem 1.5rem', borderRadius: '8px', fontWeight: 700, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideUp 0.3s ease-out', zIndex: 1000
        }}>
          {toastMessage}
        </div>
      )}

      <style>{`
         @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
         }
      `}</style>
    </div>
  );
};

export default Reports;
