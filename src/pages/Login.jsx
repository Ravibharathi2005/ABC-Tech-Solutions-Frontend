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

      // Save employee session
      login(empId);

      sessionStorage.setItem("portalUser", empId);

      await logActivity(empId, "Logged In");

      navigate("/portal");

    } catch (err) {
      console.error("Login Error:", err);
      // Try to parse the specific error message sent from the backend
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Login failed (401 Unauthorized). Please check your matching Employee ID and Password!";
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

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;