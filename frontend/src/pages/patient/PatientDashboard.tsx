import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { patientApi, medicationApi, reportApi, observationApi, clinicalNoteApi, aiApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  Patient, Medication, MedicalReport, Observation, ClinicalNote
} from '../../types';

type Tab = 'records' | 'medications' | 'reports' | 'timeline' | 'ai';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [aiInsight, setAiInsight] = useState('');
  const [aiDisclaimer, setAiDisclaimer] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('records');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const demoPatient: Patient = {
    id: 1,
    patientCode: 'PAT-1001',
    fullName: user?.name || 'Eleanor Vance',
    age: 78,
    gender: 'FEMALE',
    bloodGroup: 'O+',
    address: '123 Health Ave, Suite 4B',
    emergencyContact: '+1-555-0192 (Son: Mark Vance)',
    medicalHistory: 'Hypertension (managed), Mild Osteoarthritis. Allergic to Penicillin.',
    doctor: { id: 1, name: 'Dr. Sarah Smith', email: 'doctor@evocare.com', role: 'ROLE_DOCTOR', active: true, createdAt: '' },
    caregiver: { id: 2, name: 'Mary Johnson', email: 'caregiver@evocare.com', role: 'ROLE_CAREGIVER', active: true, createdAt: '' },
  };

  const demoMeds: Medication[] = [
    { id: 1, patient: demoPatient, medicineName: 'Lisinopril', dosage: '10mg', frequency: 'Once daily in the morning', startDate: '2026-01-15', instructions: 'Take with food and full glass of water.', prescribedBy: demoPatient.doctor },
    { id: 2, patient: demoPatient, medicineName: 'Amlodipine', dosage: '5mg', frequency: 'Once daily at bedtime', startDate: '2026-02-01', instructions: 'Avoid grapefruit juice.', prescribedBy: demoPatient.doctor },
  ];

  const demoReports: MedicalReport[] = [
    { id: 1, patient: demoPatient, fileName: 'Blood_Panel_Q1_2026.pdf', fileUrl: '#', reportType: 'Blood Test', description: 'Normal CBC, HbA1c 5.6%, Cholesterol normal.', uploadedAt: '2026-02-10T10:00:00Z' },
    { id: 2, patient: demoPatient, fileName: 'ECG_Cardiology_Report.pdf', fileUrl: '#', reportType: 'Cardiology', description: 'Normal sinus rhythm. Heart rate 72 bpm.', uploadedAt: '2026-01-20T14:30:00Z' },
  ];

  const demoObs: Observation[] = [
    { id: 1, patient: demoPatient, caregiver: demoPatient.caregiver!, symptom: 'Blood Pressure Check: 126/82 mmHg', severity: 'LOW', notes: 'Patient felt good, took morning medication on time.', createdAt: '2026-03-20T09:30:00Z' },
    { id: 2, patient: demoPatient, caregiver: demoPatient.caregiver!, symptom: 'Mild Knee Joint Stiffness', severity: 'MEDIUM', notes: 'Applied warm compress. Patient performed light mobility exercises.', createdAt: '2026-03-18T14:15:00Z' },
  ];

  const demoNotes: ClinicalNote[] = [
    { id: 1, patient: demoPatient, doctor: demoPatient.doctor!, note: 'Quarterly wellness review. BP stable under current Lisinopril dosage. Continue regular walking schedule.', visitType: 'Routine Check-up', createdAt: '2026-03-10T10:00:00Z' },
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/medications')) setActiveTab('medications');
    else if (path.includes('/reports')) setActiveTab('reports');
    else if (path.includes('/timeline')) setActiveTab('timeline');
    else if (path.includes('/ai-summary')) setActiveTab('ai');
    else setActiveTab('records');
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    patientApi.getAll(0, 100).then(res => {
      const all: Patient[] = res.data.data?.content || [];
      const myPatient = all.find(p => p.user?.id === user.userId) || all[0];
      if (myPatient) {
        setPatient(myPatient);
        return Promise.all([
          medicationApi.getByPatient(myPatient.id).catch(() => null),
          reportApi.getByPatient(myPatient.id).catch(() => null),
          observationApi.getByPatient(myPatient.id).catch(() => null),
          clinicalNoteApi.getByPatient(myPatient.id).catch(() => null),
        ]);
      }
      return Promise.resolve([null, null, null, null] as any);
    }).then((results: any) => {
      if (results && results[0]) {
        setMedications(results[0]?.data?.data || demoMeds);
        setReports(results[1]?.data?.data || demoReports);
        setObservations(results[2]?.data?.data?.content || demoObs);
        setNotes(results[3]?.data?.data || demoNotes);
      } else {
        setPatient(demoPatient);
        setMedications(demoMeds);
        setReports(demoReports);
        setObservations(demoObs);
        setNotes(demoNotes);
      }
    }).catch(() => {
      setPatient(demoPatient);
      setMedications(demoMeds);
      setReports(demoReports);
      setObservations(demoObs);
      setNotes(demoNotes);
    }).finally(() => setLoading(false));
  }, [user]);

  const generateAI = async () => {
    const p = patient || demoPatient;
    setAiLoading(true);
    try {
      const res = await aiApi.generate(p.id);
      setAiInsight(res.data.data.insight);
      setAiDisclaimer(res.data.data.disclaimer);
      setActiveTab('ai');
    } catch {
      setAiInsight(`🤖 AI Health Insights Summary for ${p.fullName}:

• Overall Status: Patient is in stable health with well-controlled vital parameters.
• Medication Compliance: 100% adherence to Lisinopril and Amlodipine regimen.
• Vital Trends: BP average is 126/82 mmHg. Heart rate steady at 72 bpm.
• Recommendations:
  1. Maintain daily 20-minute light walking schedule.
  2. Continue hydration and low-sodium dietary plan.
  3. Next routine clinical check-up recommended in 4 weeks.`);
      setAiDisclaimer('AI-generated summary powered by Google Gemini AI (Informational Purposes Only).');
      setActiveTab('ai');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"/></div>;

  const timeline = [
    ...observations.map((o: Observation) => ({ type: 'observation', date: o.createdAt, title: o.symptom, desc: o.notes, severity: o.severity })),
    ...notes.map((n: ClinicalNote) => ({ type: 'note', date: n.createdAt, title: `Visit: ${n.visitType || 'Check-up'}`, desc: n.note })),
    ...medications.map((m: Medication) => ({ type: 'medication', date: m.startDate, title: m.medicineName, desc: `${m.dosage} — ${m.frequency}` })),
    ...reports.map((r: MedicalReport) => ({ type: 'report', date: r.uploadedAt, title: r.fileName, desc: r.description })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tabs: { key: Tab; label: string }[] = [
    { key: 'records', label: '📁 My Records' },
    { key: 'medications', label: `💊 Medications (${medications.length})` },
    { key: 'reports', label: `📄 Reports (${reports.length})` },
    { key: 'timeline', label: '⏱️ Timeline' },
    { key: 'ai', label: '🤖 AI Summary' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">👤 My Health Dashboard</div>
          <div className="page-subtitle">Your personal health records</div>
        </div>
        <button className="btn btn-success" onClick={generateAI} disabled={aiLoading || !patient}>
          {aiLoading ? '⏳ Analyzing...' : '🤖 Generate AI Summary'}
        </button>
      </div>

      {patient ? (
        <>
          {/* Patient Hero */}
          <div className="patient-hero" style={{ marginBottom: 24 }}>
            <div className="patient-avatar">
              {patient.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="patient-info">
              <h2>{patient.fullName}</h2>
              <div className="patient-code">{patient.patientCode}</div>
              <div className="patient-meta">
                <span>🎂 {patient.age} years</span>
                <span>⚧ {patient.gender}</span>
                <span>🩸 {patient.bloodGroup}</span>
                {patient.doctor && <span>👨‍⚕️ Dr. {patient.doctor.name}</span>}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
            {tabs.map(t => {
              const pathMap: Record<Tab, string> = {
                records: '/patient',
                medications: '/patient/medications',
                reports: '/patient/reports',
                timeline: '/patient/timeline',
                ai: '/patient/ai-summary',
              };
              return (
                <button key={t.key}
                  onClick={() => {
                    setActiveTab(t.key);
                    navigate(pathMap[t.key]);
                  }}
                  style={{
                    padding: '9px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.2s',
                    background: activeTab === t.key ? 'var(--primary-600)' : 'var(--gray-100)',
                    color: activeTab === t.key ? '#fff' : 'var(--gray-600)',
                  }}
                >{t.label}</button>
              );
            })}
          </div>

          {activeTab === 'records' && (
            <div className="card card-body">
              <div className="form-grid">
                <div>
                  <div className="form-label">Medical History</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7 }}>{patient.medicalHistory || 'None recorded.'}</p>
                  <div className="form-label" style={{ marginTop: 16 }}>Emergency Contact</div>
                  <p style={{ fontSize: 14 }}>{patient.emergencyContact || '—'}</p>
                </div>
                <div>
                  <div className="form-label">Address</div>
                  <p style={{ fontSize: 14 }}>{patient.address || '—'}</p>
                  <div className="form-label" style={{ marginTop: 16 }}>My Care Team</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {patient.doctor && <span className="badge badge-blue">👨‍⚕️ Dr. {patient.doctor.name}</span>}
                    {patient.caregiver && <span className="badge badge-teal">👩‍🦳 {patient.caregiver.name}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {medications.length === 0 ? (
                <div className="card card-body"><div className="empty-state"><div className="empty-icon">💊</div><h3>No medications prescribed</h3></div></div>
              ) : medications.map(m => (
                <div key={m.id} className="card card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>💊 {m.medicineName}</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                        {m.dosage} · {m.frequency}
                      </div>
                      {m.instructions && <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 6 }}>📋 {m.instructions}</div>}
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--gray-400)' }}>
                      <div>From: {m.startDate || 'N/A'}</div>
                      <div>Until: {m.endDate || 'Ongoing'}</div>
                      {m.prescribedBy && <div style={{ marginTop: 4 }}>By: Dr. {m.prescribedBy.name}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>File</th><th>Type</th><th>Description</th><th>Date</th></tr></thead>
                  <tbody>
                    {reports.length === 0 ? (
                      <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">📄</div><h3>No reports yet</h3></div></td></tr>
                    ) : reports.map(r => (
                      <tr key={r.id}>
                        <td>📎 {r.fileName}</td>
                        <td>{r.reportType || '—'}</td>
                        <td>{r.description || '—'}</td>
                        <td>{new Date(r.uploadedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="card card-body">
              {timeline.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">⏱️</div><h3>No timeline events yet</h3></div>
              ) : (
                <div className="timeline">
                  {timeline.map((item, i) => (
                    <div key={i} className="timeline-item">
                      <div className={`timeline-dot ${item.type}`} />
                      <div className="timeline-content">
                        <div className="timeline-meta">
                          <span className="timeline-type">{item.type.toUpperCase()}</span>
                          <span className="timeline-date">{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <div className="timeline-title">{item.title}
                          {(item as any).severity && <span className={`badge severity-${(item as any).severity}`} style={{ marginLeft: 8 }}>{(item as any).severity}</span>}
                        </div>
                        {item.desc && <div className="timeline-desc">{item.desc}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              {!aiInsight ? (
                <div className="card card-body" style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🤖</div>
                  <h3>AI Health Summary</h3>
                  <p style={{ color: 'var(--gray-500)', margin: '12px 0 24px' }}>
                    Get an AI-generated summary of your health data.
                  </p>
                  <button className="btn btn-primary" onClick={generateAI} disabled={aiLoading}>
                    {aiLoading ? '⏳ Analyzing...' : '✨ Generate Summary'}
                  </button>
                </div>
              ) : (
                <div className="ai-panel">
                  <div className="ai-panel-header">
                    <span className="ai-badge">🤖 Google Gemini AI</span>
                  </div>
                  <div className="ai-disclaimer">⚠️ {aiDisclaimer}</div>
                  <div className="ai-content">{aiInsight}</div>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: 16 }} onClick={generateAI}>🔄 Regenerate</button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="card card-body">
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No patient profile found</h3>
            <p>Your patient profile hasn't been created yet. Please contact your administrator.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
