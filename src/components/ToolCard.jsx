import React from "react";
import { FiLock, FiExternalLink, FiClock } from "react-icons/fi";

/**
 * ToolCard – reusable card for a single software tool.
 *
 * Props:
 *  tool        { name, url, emoji, category, description }
 *  locked      bool – true if this tool needs admin approval for this user
 *  approved    bool – true if admin has approved access for current session
 *  pending     bool – true if request is already pending
 *  onOpen      fn   – called when user clicks Open on an unlocked tool
 *  onRequest   fn   – called when user clicks Request Access on a locked tool
 */
const ToolCard = ({ tool, locked, approved, pending, onOpen, onRequest }) => {
  const isAccessible = !locked || approved;

  const handleAction = () => {
    if (isAccessible) {
      onOpen(tool);
    } else {
      onRequest(tool);
    }
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${isAccessible ? "var(--border-color)" : "rgba(239,68,68,0.15)"}`,
        borderRadius: "16px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      className="tool-card"
    >
      {/* Lock / Pending badge */}
      {locked && !approved && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: pending
              ? "rgba(245,158,11,0.15)"
              : "rgba(239,68,68,0.12)",
            color: pending ? "#f59e0b" : "#ef4444",
            borderRadius: "8px",
            padding: "3px 10px",
            fontSize: "0.65rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {pending ? <FiClock size={10} /> : <FiLock size={10} />}
          {pending ? "Pending" : "Locked"}
        </div>
      )}

      {approved && locked && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(16,185,129,0.12)",
            color: "var(--security-green)",
            borderRadius: "8px",
            padding: "3px 10px",
            fontSize: "0.65rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          ✓ Session Access
        </div>
      )}

      {/* Tool icon + name */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: isAccessible
              ? "rgba(59,130,246,0.1)"
              : "rgba(239,68,68,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.6rem",
            flexShrink: 0,
            filter: locked && !approved ? "grayscale(60%)" : "none",
            transition: "filter 0.3s",
          }}
        >
          {tool.emoji}
        </div>
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "0.95rem",
              color: isAccessible ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            {tool.name}
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              opacity: 0.7,
            }}
          >
            {tool.category}
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          flexGrow: 1,
        }}
      >
        {tool.description}
      </div>

      {/* Action button */}
      <button
        onClick={handleAction}
        style={{
          width: "100%",
          padding: "0.65rem 1rem",
          borderRadius: "10px",
          border: "none",
          fontWeight: 700,
          fontSize: "0.8rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          transition: "all 0.25s ease",
          background: isAccessible
            ? "linear-gradient(135deg, var(--accent-color), #2563eb)"
            : pending
            ? "rgba(245,158,11,0.12)"
            : "rgba(239,68,68,0.1)",
          color: isAccessible
            ? "white"
            : pending
            ? "#f59e0b"
            : "#ef4444",
          boxShadow: isAccessible
            ? "0 4px 12px rgba(59,130,246,0.25)"
            : "none",
        }}
      >
        {isAccessible ? (
          <>
            <FiExternalLink size={13} /> Open
          </>
        ) : pending ? (
          <>
            <FiClock size={13} /> Awaiting Approval
          </>
        ) : (
          <>
            <FiLock size={13} /> Request Access
          </>
        )}
      </button>

      <style>{`
        .tool-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-color) !important;
          box-shadow: 0 12px 30px -8px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
};

export default ToolCard;
