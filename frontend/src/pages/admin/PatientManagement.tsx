import React, { useEffect, useState } from 'react';
import { patientApi, userApi } from '../../api';
import { Patient, User } from '../../types';
import { useNavigate } from 'react-router-dom';
import { getMergedPatients, savePatientToStore } from '../../utils/patientStore';

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    fullName: '', age: '', gender: 'Male', bloodGroup: 'O+',
    address: '', emergencyContact: '', medicalHistory: ''
  });
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');

  const load = (p = 0, q = '') => {
    setLoading(true);
    const req = q
      ? patientApi.search(q, p).catch(() => ({ data: { data: { content: [] } } }))
      : patientApi.getAll(p, 10).catch(() => ({ data: { data: { content: [] } } }));
    req.then(res => {
      const data = res.data?.data;
      const content = data?.content || (Array.isArray(data) ? data : []);
      const merged = getMergedPatients(content);
      if (q) {
        setPatients(merged.filter(item =>
          item.fullName.toLowerCase().includes(q.toLowerCase()) ||
          item.patientCode.toLowerCase().includes(q.toLowerCase())
        ));
      } else {
        setPatients(merged);
      }
      setTotalPages(data?.totalPages || 1);
    }).catch(() => {
      setPatients(getMergedPatients());
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(page, search); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    load(0, search);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine next sequential patient code (PAT-1001, PAT-1002, PAT-1003, PAT-1004...)
    const currentList = getMergedPatients();
    let nextNum = 1001;
    if (currentList.length > 0) {
      const numbers = currentList
        .map(p => {
          const match = p.patientCode?.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        })
        .filter(n => n > 0);
      if (numbers.length > 0) {
        nextNum = Math.max(...numbers) + 1;
      }
    }
    const nextCode = `PAT-${nextNum}`;

    const newPatientObj: Patient = {
      id: Date.now(),
      patientCode: nextCode,
      fullName: form.fullName,
      age: parseInt(form.age) || 30,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      address: form.address,
      emergencyContact: form.emergencyContact,
      medicalHistory: form.medicalHistory,
    };

    try {
      const res = await patientApi.create({ ...form, age: parseInt(form.age), patientCode: nextCode });
      const created = res.data?.data || newPatientObj;
      if (!created.patientCode || !created.patientCode.startsWith('PAT-')) {
        created.patientCode = nextCode;
      }
      savePatientToStore(created);
    } catch {
      savePatientToStore(newPatientObj);
    }

    setPatients(getMergedPatients());
    setSuccess(`Patient ${form.fullName} (${nextCode}) created successfully!`);
    setShowCreate(false);
    setForm({ fullName: '', age: '', gender: 'Male', bloodGroup: 'O+', address: '', emergencyContact: '', medicalHistory: '' });
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🏥 Patient Management</div>
          <div className="page-subtitle">View and manage all patients</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Add Patient</button>
      </div>

      {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ {success}</div>}

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div className="search-bar" style={{ maxWidth: '100%', flex: 1 }}>
          <span className="search-icon">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or patient code..."
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
        {search && <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); load(0, ''); }}>Clear</button>}
      </form>

      {loading ? (
        <div className="loading-container"><div className="spinner"/></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Doctor</th>
                  <th>Caregiver</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32 }}>No patients found</td></tr>
                ) : patients.map(p => (
                  <tr key={p.id}>
                    <td><span className="badge badge-blue">{p.patientCode}</span></td>
                    <td><strong>{p.fullName}</strong></td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.bloodGroup}</td>
                    <td>{p.doctor?.name || <span style={{ color: 'var(--gray-400)' }}>Unassigned</span>}</td>
                    <td>{p.caregiver?.name || <span style={{ color: 'var(--gray-400)' }}>Unassigned</span>}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/admin/patients/${p.id}`)}>
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>◀</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={i === page ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>▶</button>
          </div>
        </div>
      )}

      {/* Create Patient Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Patient</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreate}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" required value={form.fullName}
                      onChange={e => setForm({...form, fullName: e.target.value})} placeholder="Patient full name"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input className="form-input" type="number" required value={form.age}
                      onChange={e => setForm({...form, age: e.target.value})} placeholder="Age"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={form.gender}
                      onChange={e => setForm({...form, gender: e.target.value})}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" value={form.bloodGroup}
                      onChange={e => setForm({...form, bloodGroup: e.target.value})}>
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emergency Contact</label>
                    <input className="form-input" value={form.emergencyContact}
                      onChange={e => setForm({...form, emergencyContact: e.target.value})} placeholder="+91-XXXXXXXXXX"/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea className="form-textarea" value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address" style={{ minHeight: 70 }}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Medical History</label>
                  <textarea className="form-textarea" value={form.medicalHistory}
                    onChange={e => setForm({...form, medicalHistory: e.target.value})}
                    placeholder="Pre-existing conditions, past surgeries..."/>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Patient</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
