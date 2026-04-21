import React, { useEffect, useState } from "react";
import { FiLock, FiExternalLink, FiClock } from "react-icons/fi";

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

    const handleMessage = (event) => {
      if (event.origin !== "http://localhost:5174") return;

      if (event.data?.type === "LOGOUT_SIGNAL") {
        console.log("[Authentication Sync] Logout signal received");
        sessionStorage.clear();
        setHasAccess(false);
      }
    };

    window.addEventListener("message", handleMessage);

    const poller = setInterval(() => {
      if (sessionStorage.getItem("monitoringSession") !== "true" && hasAccess) {
        setHasAccess(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(poller);
    };
  }, [hasAccess]);

  const openSecurity = () => {
    window.open("http://localhost:5174/login", "_blank");
  };

  if (!hasAccess) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '520px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '50%',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-color)'
            }}>
              <FiLock fontSize="2rem" />
            </div>
          </div>

          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 800, 
            letterSpacing: '-0.02em', 
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Identity Verification Required
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '2.5rem', 
            fontSize: '1rem',
            lineHeight: 1.6
          }}>
            Access to the Employee Portal requires an active identity verification session. Please log in through the **Corporate Authentication Portal** to continue.
          </p>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '1.25rem', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <FiClock style={{ color: 'var(--accent-color)', fontSize: '1.5rem', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Your session has expired or the identity token is missing. This is a standard security requirement.
            </span>
          </div>

          <button
            className="btn-primary"
            onClick={openSecurity}
            style={{ width: '100%', gap: '12px', padding: '1.25rem' }}
          >
            Authenticate Identity <FiExternalLink />
          </button>

          <style>{`
            .btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <iframe
        src="http://localhost:5174/broadcaster.html"
        style={{ display: "none" }}
        title="Auth Sync"
      />
      {children}
    </>
  );
};

export default SecurityWrapper;