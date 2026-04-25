import React, { useState } from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiPlus, FiAlertCircle } from 'react-icons/fi';

const Leave = () => {
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Annual Leave', from: '2026-05-10', to: '2026-05-15', days: 5, status: 'APPROVED' },
    { id: 2, type: 'Sick Leave', from: '2026-04-02', to: '2026-04-03', days: 2, status: 'APPROVED' }
  ]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [newLeave, setNewLeave] = useState({ type: 'Annual Leave', from: '', to: '', reason: '' });

  const leaveBalance = {
    annual: 15,
    sick: 8,
    casual: 5
  };

  const handleApply = (e) => {
    e.preventDefault();
    const fromDate = new Date(newLeave.from);
    const toDate = new Date(newLeave.to);
    const days = Math.max(1, Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1);

    setLeaves([{ id: Date.now(), ...newLeave, days, status: 'PENDING' }, ...leaves]);
    setShowApplyModal(false);
    setNewLeave({ type: 'Annual Leave', from: '', to: '', reason: '' });
  };

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Leave Management</h1>
          <p>Request time off and view your leave balances.</p>
        </div>
        <button onClick={() => setShowApplyModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          <FiPlus /> APPLY LEAVE
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ background: 'rgba(59, 130, 246, 0.05)', borderTop: '4px solid var(--accent-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Annual Leave</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-color)' }}>{leaveBalance.annual}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Days Remaining</div>
        </div>
        <div className="card" style={{ background: 'rgba(16, 185, 129, 0.05)', borderTop: '4px solid var(--security-green)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Sick Leave</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--security-green)' }}>{leaveBalance.sick}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Days Remaining</div>
        </div>
        <div className="card" style={{ background: 'rgba(245, 158, 11, 0.05)', borderTop: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Casual Leave</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b' }}>{leaveBalance.casual}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Days Remaining</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <FiCalendar style={{ color: 'var(--accent-color)' }} /> <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Leave History</h3>
        </div>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                <th style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>Leave Type</th>
                <th style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>From Date</th>
                <th style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>To Date</th>
                <th style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>Days</th>
                <th style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1.25rem', fontWeight: 700 }}>{leave.type}</td>
                  <td style={{ padding: '1.25rem' }}>{new Date(leave.from).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem' }}>{new Date(leave.to).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem', fontWeight: 700 }}>{leave.days}</td>
                  <td style={{ padding: '1.25rem' }}>
                     {leave.status === 'APPROVED' ? (
                       <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--security-green)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FiCheckCircle /> APPROVED
                       </span>
                     ) : leave.status === 'PENDING' ? (
                       <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FiClock /> PENDING
                       </span>
                     ) : (
                       <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FiXCircle /> REJECTED
                       </span>
                     )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                   <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                     <FiAlertCircle style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} />
                     <div>No leave history found.</div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showApplyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
           <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', animation: 'slideUp 0.3s ease-out' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>Apply for Leave</h2>
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>Leave Type</label>
                    <select value={newLeave.type} onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                       <option>Annual Leave</option>
                       <option>Sick Leave</option>
                       <option>Casual Leave</option>
                       <option>Maternity Leave</option>
                       <option>Unpaid Leave</option>
                    </select>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>From</label>
                      <input type="date" value={newLeave.from} onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>To</label>
                      <input type="date" value={newLeave.to} onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                    </div>
                 </div>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>Reason</label>
                    <textarea value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })} rows="3" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
                 </div>
                 <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowApplyModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700 }}>CANCEL</button>
                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px' }}>SUBMIT REQUEST</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
