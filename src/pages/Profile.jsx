import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import axios from 'axios';
import { 
  FiUser, FiBriefcase, FiMail, FiPhone, FiInfo, 
  FiRefreshCw, FiMapPin, FiCalendar, FiClock,
  FiHome, FiUsers, FiAward, FiSmartphone, FiShield
} from 'react-icons/fi';

const Profile = () => {
  const { employeeId, role, token } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/user/profile/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setEmployeeData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching employee profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && token) {
      fetchProfile();
      logActivity(employeeId, "PROFILE_VIEW", "Viewing personal profile information");
    }
  }, [employeeId, token]);

  const detailGroup = (icon, label, value) => {
    if (!value) return null;
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem', 
        padding: '1.25rem 0', 
        borderBottom: '1px solid var(--border-color)',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <div style={{ 
          color: 'var(--accent-color)', 
          fontSize: '1.2rem',
          background: 'rgba(59, 130, 246, 0.05)',
          width: '45px',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          flexShrink: 0
        }}>{icon}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Employee Profile</h1>
          <p>Official Record for {employeeId} • {employeeData?.status || 'ACTIVE'}</p>
        </div>
        {loading && (
          <div style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiRefreshCw className="spin" /> UPDATING
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
        {/* Left Column: Personal Summary & Core Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2.5rem', borderTop: '4px solid var(--accent-color)' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
              <div style={{ 
                width: '140px', 
                height: '140px', 
                borderRadius: '50%', 
                background: 'var(--accent-color)', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                color: 'white',
                fontWeight: 900,
                boxShadow: '0 15px 30px rgba(59, 130, 246, 0.2)'
              }}>
                {employeeData?.name?.[0] || employeeId?.[0]}
              </div>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{employeeData?.name}</h2>
            <p style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2.5rem' }}>
              {employeeData?.position} • {employeeData?.department}
            </p>
            
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
               <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Employment Status</div>
               <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--security-green)' }}>{employeeData?.status || 'ACTIVE'}</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiBriefcase style={{ color: 'var(--accent-color)' }} /> Core Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {detailGroup(<FiCalendar />, "Joining Date", employeeData?.joiningDate)}
              {detailGroup(<FiInfo />, "Employment Type", employeeData?.employmentType)}
              {detailGroup(<FiShield />, "Salary Grade", employeeData?.salaryGrade)}
              {detailGroup(<FiUsers />, "Reporting Manager", employeeData?.manager)}
            </div>
          </div>

          {employeeData?.skills?.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiAward style={{ color: 'var(--accent-color)' }} /> Expertise & Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {employeeData.skills.map((skill, i) => (
                  <span key={i} style={{ 
                    padding: '6px 14px', 
                    background: 'rgba(59, 130, 246, 0.08)', 
                    color: 'var(--accent-color)', 
                    borderRadius: '99px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Contact & Personal Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiSmartphone style={{ color: 'var(--accent-color)' }} /> Contact & Location
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {detailGroup(<FiMail />, "Corporate Email", employeeData?.email)}
              {detailGroup(<FiPhone />, "Mobile Number", employeeData?.phone)}
              {detailGroup(<FiMapPin />, "Primary Location", employeeData?.workLocation)}
              {detailGroup(<FiClock />, "Shift Details", employeeData?.shift)}
              {detailGroup(<FiHome />, "Residential Address", employeeData?.address)}
              {detailGroup(<FiSmartphone />, "Emergency Contact", employeeData?.emergencyContact)}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiUser style={{ color: 'var(--accent-color)' }} /> Personal Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {detailGroup(<FiCalendar />, "Date of Birth", employeeData?.dob)}
              {detailGroup(<FiInfo />, "Gender Identity", employeeData?.gender)}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .spin { animation: rotate 2s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Profile;
