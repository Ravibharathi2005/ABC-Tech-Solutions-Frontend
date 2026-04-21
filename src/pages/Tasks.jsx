import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { FiCheckSquare, FiPlay, FiCheck, FiActivity, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const Tasks = () => {
  const { employeeId, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logActivity(employeeId, "TASK_VIEW", "Reviewing assigned tasks");
    fetchTasks();
  }, [employeeId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.length === 0) {
        await axios.post('http://localhost:8080/api/tasks/seed', {}, {
           headers: { Authorization: `Bearer ${token}` }
        });
        const reFetch = await axios.get('http://localhost:8080/api/tasks', {
           headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(reFetch.data);
      } else {
        setTasks(res.data);
      }
    } catch (err) {
      console.error("Task fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await axios.patch(`http://localhost:8080/api/tasks/${taskId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logActivity(employeeId, "TASK_UPDATE", `Task ${taskId} moved to ${status}`);
      fetchTasks();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'URGENT': return '#ef4444';
      case 'HIGH': return '#f59e0b';
      case 'MEDIUM': return '#3b82f6';
      default: return '#10b981';
    }
  };

  const TaskColumn = ({ title, status, icon, color }) => (
    <div style={{ 
      background: 'rgba(15, 23, 42, 0.4)', 
      borderRadius: '24px', 
      padding: '2rem', 
      minHeight: '600px', 
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: color, fontSize: '1.4rem' }}>{icon}</span>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h3>
        </div>
        <span style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '4px 12px', 
          borderRadius: '99px',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: 'var(--text-secondary)'
        }}>
          {tasks.filter(t => t.status === status).length}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {tasks.filter(t => t.status === status).map((task, idx) => (
           <div key={task._id} className="card" style={{ 
             padding: '1.5rem', 
             borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
             animation: `slideIn 0.4s ease-out ${idx * 0.1}s both`,
             background: 'var(--bg-card)'
           }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 900, 
                  background: `${getPriorityColor(task.priority)}15`, 
                  padding: '4px 10px', 
                  borderRadius: '6px',
                  color: getPriorityColor(task.priority),
                  letterSpacing: '0.05em'
                }}>{task.priority}</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600
                }}><FiClock /> {new Date(task.deadline).toLocaleDateString()}</span>
              </div>
              
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.4 }}>{task.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Project: {task.category || 'Standard'}</p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {status === 'TODO' && (
                  <button onClick={() => updateStatus(task._id, 'IN_PROGRESS')} className="btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '10px' }}>
                    <FiPlay fontSize="0.9rem" /> START TASK
                  </button>
                )}
                {status === 'IN_PROGRESS' && (
                  <button onClick={() => updateStatus(task._id, 'DONE')} className="btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'var(--security-green)' }}>
                    <FiCheck fontSize="1rem" /> MARK COMPLETE
                  </button>
                )}
                {status === 'DONE' && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--security-green)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiCheckCircle fontSize="1.1rem" /> COMPLETED
                  </div>
                )}
              </div>
           </div>
        ))}
        {tasks.filter(t => t.status === status).length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--border-color)', borderRadius: '16px', opacity: 0.5 }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}><FiAlertCircle /></div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>No tasks in this category.</div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Task Management</h1>
          <p>Organize and track your assigned project deliverables.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        <TaskColumn title="Pending" status="TODO" icon={<FiCheckSquare />} color="var(--accent-color)" />
        <TaskColumn title="In Progress" status="IN_PROGRESS" icon={<FiActivity />} color="#f59e0b" />
        <TaskColumn title="Completed" status="DONE" icon={<FiCheckCircle />} color="var(--security-green)" />
      </div>
    </div>
  );
};

export default Tasks;
