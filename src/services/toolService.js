import axios from "axios";

const BASE_URL = "http://localhost:8080/api/tools";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

/**
 * Fetch all tool requests (admin only).
 */
export const fetchAllRequests = async () => {
  const res = await axios.get(`${BASE_URL}/requests`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/**
 * Submit an access request for a restricted tool.
 * @param {string} toolName
 * @param {string} toolCategory  "Cloud" | "Office"
 * @param {string} sessionId     The employee's current portal sessionId
 */
export const submitAccessRequest = async (toolName, toolCategory, sessionId) => {
  const res = await axios.post(
    `${BASE_URL}/request`,
    { toolName, toolCategory, sessionId },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

/**
 * Approve a request by ID (admin only).
 */
export const approveRequest = async (requestId) => {
  const res = await axios.patch(`${BASE_URL}/approve/${requestId}`, {}, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/**
 * Reject a request by ID (admin only).
 */
export const rejectRequest = async (requestId, adminNote = "") => {
  const res = await axios.patch(
    `${BASE_URL}/reject/${requestId}`,
    { adminNote },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

/**
 * Fetch the list of tool names the current user has approved access to
 * for their CURRENT session. Returns [] if session is expired.
 * @param {string} sessionId
 */
export const fetchMyAccess = async (sessionId) => {
  if (!sessionId) return [];
  const res = await axios.get(`${BASE_URL}/my-access`, {
    params: { sessionId },
    headers: getAuthHeaders(),
  });
  return res.data.approvedTools || [];
};
