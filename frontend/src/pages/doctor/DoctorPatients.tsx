import React, { useEffect, useState } from 'react';
import { patientApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../types';
import { getMergedPatients } from '../../utils/patientStore';

const DoctorPatients: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    Promise.all([
      patientApi.getByDoctor(user.userId).catch(() => ({ data: { data: [] } })),
      patientApi.getAll(0, 100).catch(() => ({ data: { data: { content: [] } } })),
    ]).then(([pRes, allRes]) => {
      const assigned: Patient[] = pRes.data?.data || [];
      const all: Patient[] = allRes.data?.data?.content || allRes.data?.data || [];
      const apiList = [...assigned, ...all];
      setPatients(getMergedPatients(apiList));
    }).catch(() => {
      setPatients(getMergedPatients());
    }).finally(() => setLoading(false));
  }, [user]);

  const filtered = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.patientCode.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-container"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">👥 My Patients</div>
          <div className="page-subtitle">{patients.length} patient{patients.length !== 1 ? 's' : ''} assigned to you</div>
        </div>
      </div>

      <div className="search-bar" style={{ maxWidth: 360, marginBottom: 20 }}>
        <span className="search-icon">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..."/>
      </div>

      {filtered.length === 0 ? (
        <div className="card card-body">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No patients found</h3>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filtered.map(p => (
            <div key={p.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 20
                }}>
                  {p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.fullName}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{p.patientCode}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <span className="badge badge-gray">🎂 {p.age} yrs</span>
                <span className="badge badge-gray">⚧ {p.gender}</span>
                <span className="badge badge-red">🩸 {p.bloodGroup}</span>
              </div>
              {p.caregiver && (
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14 }}>
                  👩‍🦳 Caregiver: <strong>{p.caregiver.name}</strong>
                </div>
              )}
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate(`/doctor/patients/${p.id}`)}>
                View Full Record →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
