import React, { useEffect, useState } from "react";

const SecurityWrapper = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("monitoringSession") === "true") {
      sessionStorage.setItem("monitoringSession", "true");
      setHasAccess(true);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    } else {
      setHasAccess(
        sessionStorage.getItem("monitoringSession") === "true"
      );
    }

    const handleStorage = (e) => {
      if (e.key === "forceLogout") {
        sessionStorage.clear(); // Clears monitoringSession, portalUser, employeeId, everything!
        setHasAccess(false);
      }
    };

    window.addEventListener("storage", handleStorage);

    // INTERVAL FALLBACK: 
    // This allows you to test the logout via the SAME tab console. 
    // Browsers natively block 'storage' events from firing in the exact same tab where the code ran.
    // Also, if you use different ports (5174 vs 5173), ports don't natively share localStorage!
    const poller = setInterval(() => {
      const logoutTime = localStorage.getItem("forceLogout");
      if (logoutTime) {
        // If a logout signal is detected, clear session and block.
        sessionStorage.clear();
        setHasAccess(false);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(poller);
    };
  }, []);

  const openSecurity = () => {
    window.open("http://localhost:5174/login", "_blank");
  };

  if (!hasAccess) {
    return (
      <div className="blocked-container">
        <div className="blocked-card">
          <div className="blocked-icon">🔒</div>
          <h1>Security Session Expired</h1>
          <p>Please login to Security Application again.</p>
          <button
            className="btn-security"
            onClick={openSecurity}
          >
            Open Security Application
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default SecurityWrapper;