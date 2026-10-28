import React, { useEffect, useState } from 'react';
import { patientApi, observationApi, clinicalNoteApi, userApi } from '../../api';
import { Patient, DashboardStats } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMergedPatients } from '../../utils/patientStore';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    Promise.all([
      patientApi.getByDoctor(user.userId).catch(() => ({ data: { data: [] } })),
      patientApi.getAll(0, 100).catch(() => ({ data: { data: { content: [] } } })),
      userApi.getDashboardStats().catch(() => ({ data: { data: null } })),
    ]).then(([pRes, allRes, sRes]) => {
      const assigned: Patient[] = pRes.data?.data || [];
      const all: Patient[] = allRes.data?.data?.content || allRes.data?.data || [];
      const apiList = [...assigned, ...all];
      const mergedList = getMergedPatients(apiList);
      setPatients(mergedList);
      setStats({
        totalUsers: 12,
        totalDoctors: 4,
        totalCaregivers: 3,
        observationsThisMonth: 18,
        totalReports: 8,
        ...sRes.data?.data,
        totalPatients: Math.max(sRes.data?.data?.totalPatients || 0, mergedList.length),
      });
    }).catch(() => {
      const mergedList = getMergedPatients();
      setPatients(mergedList);
      setStats({ totalUsers: 12, totalPatients: mergedList.length, totalDoctors: 4, totalCaregivers: 3, observationsThisMonth: 18, totalReports: 8 });
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="loading-container"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">👨‍⚕️ Doctor Dashboard</div>
          <div className="page-subtitle">Welcome, Dr. {user?.name?.split(' ').slice(1).join(' ') || user?.name}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[
          { label: 'My Patients', value: patients.length, icon: '🧓', color: 'blue' },
          { label: 'Total Patients', value: stats?.totalPatients ?? 0, icon: '👥', color: 'teal' },
          { label: 'Monthly Observations', value: stats?.observationsThisMonth ?? 0, icon: '📋', color: 'purple' },
          { label: 'Reports Uploaded', value: stats?.totalReports ?? 0, icon: '📄', color: 'orange' },
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
      <div className="card">
        <div className="card-header">
          <span className="card-title">👥 My Assigned Patients</span>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/doctor/patients')}>View All →</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Code</th><th>Name</th><th>Age</th><th>Blood Group</th><th>Caregiver</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>No patients assigned yet</h3>
                    <p>Contact your administrator to have patients assigned to you.</p>
                  </div>
                </td></tr>
              ) : patients.map(p => (
                <tr key={p.id}>
                  <td><span className="badge badge-blue">{p.patientCode}</span></td>
                  <td><strong>{p.fullName}</strong></td>
                  <td>{p.age} yrs</td>
                  <td><span className="badge badge-red">{p.bloodGroup}</span></td>
                  <td>{p.caregiver?.name || '—'}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/doctor/patients/${p.id}`)}>
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
