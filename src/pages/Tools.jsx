import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import ToolCard from '../components/ToolCard';
import {
  fetchMyAccess, submitAccessRequest,
  fetchAllRequests, approveRequest, rejectRequest
} from '../services/toolService';
import { FiSearch, FiTool, FiRefreshCw } from 'react-icons/fi';

// ─── Tool Catalogue ───────────────────────────────────────────────────────────
const ALL_TOOLS = [
  // Development
  { name:'VS Code',       category:'Development', emoji:'💻', url:'https://code.visualstudio.com',   description:'Lightweight, powerful source-code editor by Microsoft.' },
  { name:'GitHub',        category:'Development', emoji:'🐙', url:'https://github.com',              description:'World\'s leading platform for version control and collaboration.' },
  { name:'GitLab',        category:'Development', emoji:'🦊', url:'https://gitlab.com',              description:'Complete DevOps platform for the entire software lifecycle.' },
  { name:'Bitbucket',     category:'Development', emoji:'🪣', url:'https://bitbucket.org',           description:'Git-based source code repository hosting by Atlassian.' },
  { name:'Postman',       category:'Development', emoji:'📮', url:'https://postman.com',             description:'API platform for building and testing APIs collaboratively.' },
  { name:'Docker',        category:'Development', emoji:'🐳', url:'https://docker.com',              description:'Platform for developing, shipping, and running containerized apps.' },
  { name:'IntelliJ IDEA', category:'Development', emoji:'🧠', url:'https://jetbrains.com/idea',      description:'Intelligent Java & Kotlin IDE by JetBrains.' },
  { name:'Eclipse',       category:'Development', emoji:'🌑', url:'https://eclipse.org',             description:'Open-source IDE for Java and other languages.' },
  { name:'Swagger',       category:'Development', emoji:'📋', url:'https://swagger.io',              description:'Simplify API development and documentation with Swagger tools.' },
  { name:'npm',           category:'Development', emoji:'📦', url:'https://npmjs.com',               description:'The world\'s largest software registry for JavaScript packages.' },
  // Design
  { name:'Figma',         category:'Design',      emoji:'🎨', url:'https://figma.com',               description:'Collaborative interface design tool for teams.' },
  { name:'Canva',         category:'Design',      emoji:'🖼️', url:'https://canva.com',               description:'Easy-to-use online design platform for everyone.' },
  { name:'Adobe XD',      category:'Design',      emoji:'✏️', url:'https://adobe.com/products/xd',   description:'UI/UX design and prototyping tool by Adobe.' },
  { name:'Photoshop',     category:'Design',      emoji:'🖌️', url:'https://adobe.com/products/photoshop', description:'Industry-standard image editing software.' },
  { name:'Illustrator',   category:'Design',      emoji:'🦋', url:'https://adobe.com/products/illustrator', description:'Vector graphics editor for scalable artwork.' },
  { name:'Miro',          category:'Design',      emoji:'🗂️', url:'https://miro.com',                description:'Online collaborative whiteboard platform for teams.' },
  // Productivity
  { name:'Jira',          category:'Productivity', emoji:'📊', url:'https://atlassian.com/software/jira', description:'Project tracking tool for agile software teams.' },
  { name:'Trello',        category:'Productivity', emoji:'📌', url:'https://trello.com',              description:'Visual project management using boards and cards.' },
  { name:'Notion',        category:'Productivity', emoji:'📝', url:'https://notion.so',               description:'All-in-one workspace for notes, docs, and databases.' },
  { name:'Confluence',    category:'Productivity', emoji:'📚', url:'https://atlassian.com/software/confluence', description:'Team wiki and knowledge base by Atlassian.' },
  { name:'Asana',         category:'Productivity', emoji:'🎯', url:'https://asana.com',               description:'Work management platform for teams to coordinate tasks.' },
  { name:'Monday.com',    category:'Productivity', emoji:'📅', url:'https://monday.com',              description:'Work OS for teams to run projects and workflows.' },
  { name:'ClickUp',       category:'Productivity', emoji:'⚡', url:'https://clickup.com',             description:'All-in-one productivity platform replacing multiple apps.' },
  // Communication
  { name:'Slack',         category:'Communication', emoji:'💬', url:'https://slack.com',              description:'Channel-based messaging platform for teams.' },
  { name:'Microsoft Teams',category:'Communication',emoji:'🟦', url:'https://teams.microsoft.com',    description:'Chat, meetings, and collaboration hub by Microsoft.' },
  { name:'Zoom',          category:'Communication', emoji:'📹', url:'https://zoom.us',                description:'Video conferencing platform for remote meetings.' },
  { name:'Google Meet',   category:'Communication', emoji:'🎦', url:'https://meet.google.com',        description:'Secure video meetings powered by Google.' },
  { name:'Discord',       category:'Communication', emoji:'🎮', url:'https://discord.com',            description:'Voice, video, and text communication for communities.' },
  { name:'Skype',         category:'Communication', emoji:'☁️', url:'https://skype.com',              description:'Classic video and voice calling platform by Microsoft.' },
  // Cloud (restricted)
  { name:'AWS',           category:'Cloud', emoji:'☁️', url:'https://aws.amazon.com',                description:'Amazon Web Services — leading cloud computing platform.' },
  { name:'Microsoft Azure',category:'Cloud',emoji:'🔷', url:'https://azure.microsoft.com',           description:'Microsoft\'s enterprise cloud services platform.' },
  { name:'Google Cloud',  category:'Cloud', emoji:'🌐', url:'https://cloud.google.com',              description:'Google\'s suite of cloud computing services.' },
  { name:'Vercel',        category:'Cloud', emoji:'▲',  url:'https://vercel.com',                    description:'Frontend cloud platform for deploying web applications.' },
  { name:'Netlify',       category:'Cloud', emoji:'🌿', url:'https://netlify.com',                   description:'Platform for automating web projects with CI/CD.' },
  { name:'Firebase',      category:'Cloud', emoji:'🔥', url:'https://firebase.google.com',           description:'Google\'s mobile and web application development platform.' },
  { name:'DigitalOcean',  category:'Cloud', emoji:'🌊', url:'https://digitalocean.com',              description:'Cloud infrastructure provider focused on simplicity.' },
  // Office (restricted)
  { name:'Google Docs',   category:'Office', emoji:'📄', url:'https://docs.google.com',              description:'Collaborative document editing in the browser.' },
  { name:'Google Sheets', category:'Office', emoji:'📊', url:'https://sheets.google.com',            description:'Online spreadsheets with real-time collaboration.' },
  { name:'Google Drive',  category:'Office', emoji:'💾', url:'https://drive.google.com',             description:'Cloud storage and file sharing by Google.' },
  { name:'Excel Online',  category:'Office', emoji:'🟢', url:'https://office.live.com/start/Excel.aspx',  description:'Microsoft Excel accessible directly in the browser.' },
  { name:'Word Online',   category:'Office', emoji:'🔵', url:'https://office.live.com/start/Word.aspx',   description:'Microsoft Word accessible directly in the browser.' },
  { name:'PowerPoint Online',category:'Office',emoji:'🟠',url:'https://office.live.com/start/PowerPoint.aspx', description:'Microsoft PowerPoint accessible in the browser.' },
  { name:'OneDrive',      category:'Office', emoji:'🗄️', url:'https://onedrive.live.com',            description:'Microsoft\'s cloud storage and file sync service.' },
];

const CATEGORIES = ['All', 'Development', 'Design', 'Productivity', 'Communication', 'Cloud', 'Office'];
const RESTRICTED = ['Cloud', 'Office'];
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div style={{ position:'fixed', bottom:'2rem', right:'2rem', zIndex:9999, display:'flex', flexDirection:'column', gap:'0.5rem' }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === 'success' ? 'var(--security-green)' : t.type === 'error' ? 'var(--danger-color)' : '#f59e0b',
        color:'white', padding:'0.875rem 1.25rem', borderRadius:'12px', fontWeight:700,
        fontSize:'0.85rem', boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
        display:'flex', alignItems:'center', gap:'8px', animation:'slideUp 0.3s ease-out',
        maxWidth:'320px'
      }}>
        {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : '⏳'} {t.message}
      </div>
    ))}
  </div>
);

// ─── Access Request Modal ─────────────────────────────────────────────────────
const RequestModal = ({ tool, onConfirm, onCancel, loading }) => (
  <div style={{
    position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000,
    display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)'
  }}>
    <div style={{
      background:'var(--bg-card)', border:'1px solid rgba(239,68,68,0.3)',
      borderRadius:'24px', padding:'2.5rem', maxWidth:'440px', width:'90%',
      boxShadow:'0 40px 80px rgba(0,0,0,0.6)', animation:'fadeIn 0.3s ease-out'
    }}>
      <div style={{ fontSize:'2.5rem', marginBottom:'1rem', textAlign:'center' }}>🔒</div>
      <h2 style={{ fontSize:'1.25rem', fontWeight:800, textAlign:'center', marginBottom:'0.5rem' }}>
        Admin Approval Required
      </h2>
      <p style={{ color:'var(--text-secondary)', textAlign:'center', fontSize:'0.9rem', marginBottom:'0.5rem' }}>
        Access to <strong style={{ color:'var(--text-primary)' }}>{tool?.name}</strong> requires administrator approval.
      </p>
      <p style={{ color:'rgba(245,158,11,0.9)', textAlign:'center', fontSize:'0.8rem', marginBottom:'2rem',
        background:'rgba(245,158,11,0.08)', padding:'0.75rem', borderRadius:'8px' }}>
        ⚠️ Approval is session-based. Access will be automatically revoked when you log out.
      </p>
      <div style={{ display:'flex', gap:'1rem' }}>
        <button onClick={onCancel} disabled={loading} style={{
          flex:1, padding:'0.875rem', borderRadius:'12px', border:'1px solid var(--border-color)',
          background:'transparent', color:'var(--text-secondary)', fontWeight:700, cursor:'pointer'
        }}>Cancel</button>
        <button onClick={onConfirm} disabled={loading} style={{
          flex:2, padding:'0.875rem', borderRadius:'12px', border:'none',
          background:'linear-gradient(135deg,var(--accent-color),#2563eb)',
          color:'white', fontWeight:800, cursor:'pointer',
          boxShadow:'0 4px 12px rgba(59,130,246,0.3)'
        }}>
          {loading ? 'Submitting…' : '📨 Request Access'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Tools = () => {
  const { employeeId, role, sessionId } = useAuth();
  const isAdmin = ADMIN_ROLES.includes(role);

  const [search, setSearch]           = useState('');
  const [activeTab, setActiveTab]     = useState('All');
  const [approvedTools, setApprovedTools] = useState([]);
  const [pendingTools, setPendingTools]   = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [modalTool, setModalTool]     = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toasts, setToasts]           = useState([]);
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [adminLoading, setAdminLoading]   = useState(false);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const loadMyAccess = useCallback(async () => {
    if (!sessionId) { setLoadingAccess(false); return; }
    try {
      const approved = await fetchMyAccess(sessionId);
      setApprovedTools(approved);
    } catch {
      setApprovedTools([]);
    } finally {
      setLoadingAccess(false);
    }
  }, [sessionId]);

  const loadAdminRequests = useCallback(async () => {
    if (!isAdmin) return;
    setAdminLoading(true);
    try {
      const data = await fetchAllRequests();
      setAdminRequests(data.requests || []);
    } catch {
      toast('Failed to load requests', 'error');
    } finally {
      setAdminLoading(false);
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    if (employeeId) {
      logActivity(employeeId, 'TOOLS_HUB_ACCESS', { page: 'Tools Hub' });
      loadMyAccess();
      if (isAdmin) loadAdminRequests();
    }
  }, [employeeId, isAdmin, loadMyAccess, loadAdminRequests]);

  // Derive pending tool names from admin requests for current employee
  useEffect(() => {
    // For non-admins: poll own pending requests by filtering the my-access response
    // We store pending names directly after submitting a request
  }, []);

  const isToolLocked = (tool) => RESTRICTED.includes(tool.category) && !isAdmin;
  const isApproved   = (tool) => approvedTools.includes(tool.name);
  const isPending    = (tool) => pendingTools.includes(tool.name);

  const handleOpen = (tool) => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
    logActivity(employeeId, `Opened ${tool.name}`, { toolName: tool.name, category: tool.category });
    toast(`Opened ${tool.name}`, 'success');
  };

  const handleRequestClick = (tool) => setModalTool(tool);

  const handleConfirmRequest = async () => {
    if (!modalTool || !sessionId) return;
    setModalLoading(true);
    try {
      await submitAccessRequest(modalTool.name, modalTool.category, sessionId);
      setPendingTools(p => [...p, modalTool.name]);
      logActivity(employeeId, `Requested ${modalTool.category} Access: ${modalTool.name}`, { toolName: modalTool.name, riskLevel: 'Medium' });
      toast(`Access request sent for ${modalTool.name}`, 'info');
      setModalTool(null);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Request failed';
      if (msg.includes('already')) {
        setPendingTools(p => p.includes(modalTool.name) ? p : [...p, modalTool.name]);
        toast(msg, 'info');
      } else {
        toast(msg, 'error');
      }
      setModalTool(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleApprove = async (req) => {
    try {
      await approveRequest(req._id);
      logActivity(employeeId, `Permission Approved for ${req.toolName}`, { targetEmployee: req.employeeId, riskLevel: 'Low' });
      toast(`Approved ${req.toolName} for ${req.employeeId}`, 'success');
      loadAdminRequests();
    } catch (err) {
      toast(err?.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const handleReject = async (req) => {
    try {
      await rejectRequest(req._id);
      logActivity(employeeId, `Permission Rejected for ${req.toolName}`, { targetEmployee: req.employeeId });
      toast(`Rejected ${req.toolName} for ${req.employeeId}`, 'error');
      loadAdminRequests();
    } catch (err) {
      toast(err?.response?.data?.message || 'Rejection failed', 'error');
    }
  };

  const filteredTools = ALL_TOOLS.filter(t => {
    const matchTab = activeTab === 'All' || t.category === activeTab;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.category.toLowerCase().includes(search.toLowerCase()) ||
                        t.description.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const pendingAdminRequests = adminRequests.filter(r => r.status === 'Pending');

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.5rem' }}>
          <div style={{ background:'linear-gradient(135deg,var(--accent-color),#2563eb)', borderRadius:'14px',
            width:'48px', height:'48px', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.4rem', boxShadow:'0 8px 20px rgba(59,130,246,0.3)' }}>🛠️</div>
          <h1 style={{ margin:0 }}>Corporate Tools Hub</h1>
        </div>
        <p>Access your company-approved software stack. Restricted tools require admin approval per session.</p>
      </div>

      {/* Stats strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { label:'Total Tools',   value: ALL_TOOLS.length,         color:'var(--accent-color)' },
          { label:'Available',     value: ALL_TOOLS.filter(t=>!RESTRICTED.includes(t.category)).length, color:'var(--security-green)' },
          { label:'Restricted',    value: ALL_TOOLS.filter(t=>RESTRICTED.includes(t.category)).length,  color:'#f59e0b' },
          { label:'My Access',     value: isAdmin ? 'Full' : approvedTools.length, color:'var(--security-green)' },
        ].map((s,i) => (
          <div key={i} className="card" style={{ padding:'1.25rem', textAlign:'center' }}>
            <div style={{ fontSize:'1.75rem', fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'2rem' }}>
        <div style={{ position:'relative', maxWidth:'480px' }}>
          <FiSearch style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)' }} />
          <input
            id="tools-search"
            type="text"
            placeholder="Search tools…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width:'100%', padding:'0.875rem 1rem 0.875rem 2.75rem',
              background:'var(--bg-card)', border:'1px solid var(--border-color)',
              borderRadius:'12px', color:'var(--text-primary)', fontSize:'0.9rem',
              outline:'none', transition:'border-color 0.2s'
            }}
          />
        </div>

        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} style={{
              padding:'0.5rem 1.25rem', borderRadius:'10px', fontWeight:700, fontSize:'0.8rem',
              border: activeTab === cat ? 'none' : '1px solid var(--border-color)',
              background: activeTab === cat ? 'linear-gradient(135deg,var(--accent-color),#2563eb)' : 'transparent',
              color: activeTab === cat ? 'white' : 'var(--text-secondary)',
              cursor:'pointer', transition:'all 0.2s',
              boxShadow: activeTab === cat ? '0 4px 12px rgba(59,130,246,0.3)' : 'none'
            }}>
              {cat}
              {RESTRICTED.includes(cat) && <span style={{ marginLeft:'4px', opacity:0.7 }}>🔒</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Grid */}
      {loadingAccess ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
          {[...Array(8)].map((_,i) => (
            <div key={i} style={{ height:'180px', borderRadius:'16px', background:'var(--bg-card)',
              border:'1px solid var(--border-color)', animation:'pulse 1.5s ease-in-out infinite',
              opacity: 0.6 - i*0.05 }} />
          ))}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {filteredTools.length === 0 ? (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'4rem', color:'var(--text-secondary)' }}>
              <FiTool style={{ fontSize:'3rem', marginBottom:'1rem', opacity:0.4 }} />
              <p style={{ fontWeight:700 }}>No tools match your search</p>
            </div>
          ) : filteredTools.map(tool => (
            <ToolCard
              key={tool.name}
              tool={tool}
              locked={isToolLocked(tool)}
              approved={isApproved(tool)}
              pending={isPending(tool)}
              onOpen={handleOpen}
              onRequest={handleRequestClick}
            />
          ))}
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <div className="card" style={{ padding:'2rem', marginTop:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:800, display:'flex', alignItems:'center', gap:'0.5rem' }}>
              🛡️ Access Requests
              {pendingAdminRequests.length > 0 && (
                <span style={{ background:'var(--danger-color)', color:'white', borderRadius:'99px',
                  padding:'2px 10px', fontSize:'0.7rem', fontWeight:900 }}>
                  {pendingAdminRequests.length} Pending
                </span>
              )}
            </h2>
            <button onClick={loadAdminRequests} disabled={adminLoading} style={{
              background:'transparent', border:'1px solid var(--border-color)', borderRadius:'8px',
              padding:'0.5rem', color:'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'
            }}>
              <FiRefreshCw size={14} style={{ animation: adminLoading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>

          {adminRequests.length === 0 ? (
            <p style={{ color:'var(--text-secondary)', textAlign:'center', padding:'2rem' }}>No requests yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Tool</th>
                    <th>Category</th>
                    <th>Requested</th>
                    <th>Session Active</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminRequests.map(req => (
                    <tr key={req._id}>
                      <td style={{ fontWeight:700 }}>{req.employeeId}</td>
                      <td>{req.toolName}</td>
                      <td>
                        <span className="badge" style={{
                          background: req.toolCategory === 'Cloud' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                          color: req.toolCategory === 'Cloud' ? 'var(--accent-color)' : '#8b5cf6'
                        }}>{req.toolCategory}</span>
                      </td>
                      <td style={{ color:'var(--text-secondary)', fontSize:'0.85rem' }}>
                        {new Date(req.requestDate).toLocaleString()}
                      </td>
                      <td>
                        <span style={{
                          color: req.sessionActive ? 'var(--security-green)' : 'var(--danger-color)',
                          fontWeight:800, fontSize:'0.8rem'
                        }}>
                          {req.sessionActive ? '● Active' : '○ Expired'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${req.status === 'Pending' ? 'medium' : req.status === 'Approved' ? 'low' : 'high'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === 'Pending' && (
                          <div style={{ display:'flex', gap:'0.5rem' }}>
                            <button onClick={() => handleApprove(req)} style={{
                              padding:'0.4rem 0.875rem', borderRadius:'8px', border:'none', fontWeight:700,
                              fontSize:'0.75rem', cursor:'pointer',
                              background:'rgba(16,185,129,0.15)', color:'var(--security-green)'
                            }}>✓ Approve</button>
                            <button onClick={() => handleReject(req)} style={{
                              padding:'0.4rem 0.875rem', borderRadius:'8px', border:'none', fontWeight:700,
                              fontSize:'0.75rem', cursor:'pointer',
                              background:'rgba(239,68,68,0.1)', color:'var(--danger-color)'
                            }}>✕ Reject</button>
                          </div>
                        )}
                        {req.status !== 'Pending' && (
                          <span style={{ color:'var(--text-secondary)', fontSize:'0.8rem' }}>
                            by {req.resolvedBy || '—'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Request Modal */}
      {modalTool && (
        <RequestModal
          tool={modalTool}
          loading={modalLoading}
          onConfirm={handleConfirmRequest}
          onCancel={() => setModalTool(null)}
        />
      )}

      <Toast toasts={toasts} />

      <style>{`
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:0.8} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        #tools-search:focus { border-color: var(--accent-color) !important; }
      `}</style>
    </div>
  );
};

export default Tools;
