import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { logActivity } from "../utils/activityLogger";
import { FiShield, FiUser, FiLock, FiActivity, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!empId.trim() || !password.trim()) {
      alert("Enter Employee ID and Password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          employeeId: empId,
          password: password,
        }
      );

      const { token, role, user, employeeId: resEmpId } = res.data;

      // Robust role extraction (handle both standard and biometric payloads)
      const finalRole = role || user?.role;
      const finalEmpId = resEmpId || user?.employeeId || empId;

      // Save to auth context with personnel data only
      login({
        employeeId: finalEmpId,
        role: finalRole,
        token,
        user,
      });

      sessionStorage.setItem("portalUser", empId);
      sessionStorage.setItem("token", token);
      localStorage.removeItem("failedLoginAttempts");
      localStorage.removeItem("forceLogout");

      await logActivity(empId, "Login success", { role });
      navigate("/portal");
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed (401 Unauthorized)";

      const fails = parseInt(localStorage.getItem("failedLoginAttempts") || "0", 10) + 1;
      localStorage.setItem("failedLoginAttempts", fails);

      let actionToLog = "Failed login attempt";

      if (fails >= 3) {
        actionToLog = "Multiple failed authentication attempts";
      }

      await logActivity(empId, actionToLog, {
        errorGiven: errorMessage,
        attempts: fails,
      });

      alert(`Server Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo Placeholder */}
        <div className="auth-logo-area">
          <div className="auth-logo-circle">
            <FiShield />
          </div>
          <h2>ABC Tech Solutions</h2>
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            color: 'var(--accent-color)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em',
            marginTop: '10px'
          }}>
            Secure Enterprise Node
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-container">
            <div className="input-group">
              <label>Employee Identifier</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="e.g. EMP1001"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  required
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Security Key</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? "Decrypting..." : (
               <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 Establish Uplink <FiArrowRight />
               </span>
            )}
          </button>
        </form>

        {/* Trust Indicators */}
        <div style={{ 
          marginTop: '3rem', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          opacity: 0.5,
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FiActivity style={{ color: 'var(--security-green)' }} /> AES-256
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FiShield style={{ color: 'var(--accent-color)' }} /> Zero-Trust
          </div>
        </div>
      </div>

      <style>{`
        input {
          width: 100%;
          padding: 1.125rem 1.25rem;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          background: rgba(0, 0, 0, 0.2);
          color: var(--text-primary);
          outline: none;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        input:focus {
          border-color: var(--accent-color);
          background: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Login;