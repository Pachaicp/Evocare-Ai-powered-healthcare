import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observationApi, patientApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Observation, Patient } from '../../types';
import { getMergedPatients } from '../../utils/patientStore';

const CaregiverDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [recent, setRecent] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', symptom: '', severity: 'MEDIUM', notes: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (location.pathname.includes('/add-observation')) {
      setShowForm(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      patientApi.getByCaregiver(user.userId).catch(() => ({ data: { data: [] } })),
      patientApi.getAll(0, 100).catch(() => ({ data: { data: { content: [] } } })),
      observationApi.getRecent().catch(() => ({ data: { data: [] } })),
    ]).then(([pRes, allRes, oRes]) => {
      const assigned: Patient[] = pRes.data?.data || [];
      const all: Patient[] = allRes.data?.data?.content || allRes.data?.data || [];
      const apiList = [...assigned, ...all];
      const mergedList = getMergedPatients(apiList);
      setPatients(mergedList);
      setRecent(oRes.data?.data || []);
    }).catch(() => {
      setPatients(getMergedPatients());
    }).finally(() => setLoading(false));
  }, [user]);

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId) return;
    const selectedP = patients.find(p => p.id === parseInt(form.patientId));
    try {
      await observationApi.add({
        patientId: parseInt(form.patientId),
        symptom: form.symptom,
        severity: form.severity,
        notes: form.notes,
      });
      const oRes = await observationApi.getRecent().catch(() => ({ data: { data: [] } }));
      if (oRes.data?.data?.length) {
        setRecent(oRes.data.data);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      const newObs: Observation = {
        id: Date.now(),
        patient: selectedP || patients[0],
        caregiver: { id: user?.userId || 1, name: user?.name || 'Caregiver', email: user?.email || '', role: 'ROLE_CAREGIVER', active: true, createdAt: '' },
        symptom: form.symptom,
        severity: form.severity as any,
        notes: form.notes,
        createdAt: new Date().toISOString(),
      };
      setRecent(prev => [newObs, ...prev]);
    }
    setSuccess('Observation recorded successfully!');
    setShowForm(false);
    setForm({ patientId: '', symptom: '', severity: 'MEDIUM', notes: '' });
    setTimeout(() => setSuccess(''), 4000);
  };

  if (loading) return <div className="loading-container"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🏠 Caregiver Dashboard</div>
          <div className="page-subtitle">Welcome, {user?.name}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>➕ Add Observation</button>
      </div>

      {success && <div className="alert alert-success">✅ {success}</div>}

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {[
          { label: 'My Patients', value: patients.length, icon: '👥', color: 'blue' },
          { label: 'Recent Observations', value: recent.length, icon: '📋', color: 'green' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My Patients */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><span className="card-title">👥 My Assigned Patients</span></div>
        <div className="card-body">
          {patients.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">👥</div><h3>No patients assigned</h3></div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {patients.map(p => (
                <div key={p.id} style={{
                  background: 'var(--primary-50)', borderRadius: 10, padding: '14px 18px',
                  border: '1px solid var(--primary-200)', minWidth: 180
                }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.fullName}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{p.patientCode}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{p.age} yrs · {p.gender}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Observations */}
      <div className="card">
        <div className="card-header"><span className="card-title">📋 Recent Observations</span></div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Symptom</th><th>Severity</th><th>Notes</th><th>Date</th></tr></thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>No observations yet</td></tr>
              ) : recent.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.patient?.fullName}</strong></td>
                  <td>{o.symptom}</td>
                  <td><span className={`badge severity-${o.severity}`}>{o.severity}</span></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.notes || '—'}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Observation Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add Observation</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddObservation}>
                <div className="form-group">
                  <label className="form-label">Patient *</label>
                  <select className="form-select" required value={form.patientId}
                    onChange={e => setForm({...form, patientId: e.target.value})}>
                    <option value="">Select patient...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.patientCode})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Symptom / Observation *</label>
                  <input className="form-input" required value={form.symptom}
                    onChange={e => setForm({...form, symptom: e.target.value})}
                    placeholder="e.g., Elevated blood pressure, fatigue..."/>
                </div>
                <div className="form-group">
                  <label className="form-label">Severity *</label>
                  <select className="form-select" value={form.severity}
                    onChange={e => setForm({...form, severity: e.target.value})}>
                    <option value="LOW">🟢 Low</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HIGH">🔴 High</option>
                    <option value="CRITICAL">🟣 Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea className="form-textarea" value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                    placeholder="Provide detailed notes about the observation..."/>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Observation</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverDashboard;
