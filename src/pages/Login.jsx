// File: src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { logActivity } from "../utils/activityLogger";

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

      const { token, role, trustScore, riskLevel, user } = res.data;

      // Save to auth context with full user data
      login({
        employeeId: empId,
        role,
        trustScore,
        riskLevel,
        token,
        user,
      });

      sessionStorage.setItem("portalUser", empId);
      sessionStorage.setItem("token", token);
      localStorage.removeItem("failedLoginAttempts");

      // Log successful login activity
      await logActivity(empId, "Login success", {
        riskLevel,
        role,
      });

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
      let riskLevel = "Medium";

      if (fails >= 3) {
        actionToLog = "Too many failed attempts";
        riskLevel = "High";
      }

      await logActivity(empId, actionToLog, {
        riskLevel,
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
        <h2>Corporate Portal</h2>
        <p>ABC Tech Solutions Security Simulation</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Employee ID</label>
            <input
              type="text"
              placeholder="e.g. EMP001"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;