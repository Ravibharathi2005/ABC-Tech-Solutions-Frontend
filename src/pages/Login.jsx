import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { logActivity } from "../utils/activityLogger";

const Login = () => {
  const [empId, setEmpId] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!empId.trim()) {
      alert("Enter Employee ID");
      return;
    }

    try {
      setLoading(true);

      // 🔥 CALL BACKEND
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          employeeId: empId,
        }
      );

      // ✅ Only if backend success
      login(empId);

      // 🔥 log activity AFTER login
      await logActivity(empId, "Logged In");

      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Login failed");
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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;