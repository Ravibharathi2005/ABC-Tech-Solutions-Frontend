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
        sessionStorage.removeItem("monitoringSession");
        sessionStorage.removeItem("portalUser");
        setHasAccess(false);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
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