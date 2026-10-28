import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (role: string) => {
    const creds: Record<string, { email: string; pass: string; path: string }> = {
      doctor: { email: 'doctor@evocare.com', pass: 'Doctor@123', path: '/doctor' },
      caregiver: { email: 'caregiver@evocare.com', pass: 'Care@123', path: '/caregiver' },
      patient: { email: 'patient@evocare.com', pass: 'Patient@123', path: '/patient' },
      admin: { email: 'admin@evocare.com', pass: 'Admin@123', path: '/admin' },
    };
    const c = creds[role];
    try {
      await login(c.email, c.pass);
      navigate(c.path);
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#fff' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 60px', background: '#fff',
        borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 10px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🩺</span>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#1e40af' }}>
            EvoCare
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login"><button style={{
            padding: '9px 22px', borderRadius: 8, border: '1.5px solid #2563eb',
            background: 'transparent', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: 14
          }}>Sign In</button></Link>
          <Link to="/register"><button style={{
            padding: '9px 22px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: '#fff',
            fontWeight: 600, cursor: 'pointer', fontSize: 14,
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
          }}>Get Started</button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
        padding: '90px 60px', textAlign: 'center', color: '#fff'
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.15)',
          padding: '6px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600,
          marginBottom: 24, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          🤖 Powered by Google Gemini AI
        </div>
        <h1 style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 'clamp(36px, 5vw, 68px)',
          fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 24
        }}>
          AI-Powered Elderly<br />
          <span style={{ color: '#60a5fa' }}>Healthcare Management</span>
        </h1>
        <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Connecting doctors, caregivers, patients, and administrators in one intelligent platform.
        </p>

        {/* 1-Click Instant Demo Login Bar */}
        <div style={{
          maxWidth: 680, margin: '0 auto 36px', background: 'rgba(255,255,255,0.12)',
          padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14, color: '#93c5fd' }}>
            ⚡ 1-Click Instant Demo Portals (No Password Needed)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            <button onClick={() => handleDemo('doctor')} style={{
              padding: '12px 14px', borderRadius: 10, border: 'none', background: '#fff',
              color: '#1d4ed8', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'transform 0.2s'
            }}>👨‍⚕️ Doctor Demo</button>
            <button onClick={() => handleDemo('caregiver')} style={{
              padding: '12px 14px', borderRadius: 10, border: 'none', background: '#fff',
              color: '#1d4ed8', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'transform 0.2s'
            }}>🧑‍🌾 Caregiver</button>
            <button onClick={() => handleDemo('patient')} style={{
              padding: '12px 14px', borderRadius: 10, border: 'none', background: '#fff',
              color: '#1d4ed8', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'transform 0.2s'
            }}>👵 Patient Demo</button>
            <button onClick={() => handleDemo('admin')} style={{
              padding: '12px 14px', borderRadius: 10, border: 'none', background: '#fff',
              color: '#1d4ed8', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'transform 0.2s'
            }}>🛠️ Admin Demo</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register">
            <button style={{
              padding: '14px 36px', borderRadius: 10, border: 'none',
              background: '#fff', color: '#1d4ed8', fontWeight: 700, fontSize: 16,
              cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              🚀 Get Started Free
            </button>
          </Link>
          <Link to="/login">
            <button style={{
              padding: '14px 36px', borderRadius: 10,
              border: '2px solid rgba(255,255,255,0.4)', background: 'transparent',
              color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer'
            }}>
              Sign In →
            </button>
          </Link>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, opacity: 0.5, fontStyle: 'italic' }}>
          "AI assists. Doctors decide."
        </p>
      </section>

      {/* Stats Banner */}
      <section style={{ background: '#f8fafc', padding: '48px 60px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 32, textAlign: 'center', maxWidth: 900, margin: '0 auto'
        }}>
          {[
            { val: '4', label: 'User Roles' },
            { val: 'Gemini', label: 'AI Engine' },
            { val: 'JWT', label: 'Secure Auth' },
            { val: 'REST', label: 'API Design' },
            { val: 'PostgreSQL', label: 'Database' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1d4ed8', fontFamily: 'Plus Jakarta Sans' }}>{s.val}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 36, fontWeight: 800,
          color: '#0f172a', marginBottom: 16
        }}>Everything your care team needs</h2>
        <p style={{ color: '#64748b', fontSize: 16, marginBottom: 56, maxWidth: 500, margin: '0 auto 56px' }}>
          A unified platform designed for modern elderly healthcare management
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 28, maxWidth: 1100, margin: '0 auto'
        }}>
          {[
            {
              icon: '🤖', title: 'AI Health Insights',
              desc: 'Google Gemini analyzes observations, medications, and notes to generate intelligent health summaries — never diagnoses.',
              color: '#eff6ff', border: '#bfdbfe'
            },
            {
              icon: '🔐', title: 'JWT Security',
              desc: 'Role-based access control with BCrypt passwords, JWT access & refresh tokens, and full Spring Security integration.',
              color: '#f0fdf4', border: '#bbf7d0'
            },
            {
              icon: '⏱️', title: 'Patient Timeline',
              desc: 'Chronological view of all observations, clinical notes, medications, and reports for comprehensive care history.',
              color: '#fefce8', border: '#fde68a'
            },
            {
              icon: '📊', title: 'Admin Dashboard',
              desc: 'Real-time statistics, audit logs, user management, and patient assignments for full system oversight.',
              color: '#fdf4ff', border: '#e9d5ff'
            },
            {
              icon: '💊', title: 'Medication Tracking',
              desc: 'Doctor-prescribed medication records with dosage, frequency, and date ranges for every patient.',
              color: '#fff7ed', border: '#fed7aa'
            },
            {
              icon: '📋', title: 'Caregiver Observations',
              desc: 'Caregivers log daily health updates with severity levels, feeding directly into AI analysis pipelines.',
              color: '#f0fdfa', border: '#99f6e4'
            },
          ].map((f, i) => (
            <div key={i} style={{
              background: f.color, borderRadius: 14, padding: '28px 24px',
              border: `1px solid ${f.border}`, textAlign: 'left',
              transition: 'transform 0.2s', cursor: 'default'
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)', padding: '80px 60px', color: '#fff' }}>
        <h2 style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 34, fontWeight: 800,
          textAlign: 'center', marginBottom: 48
        }}>Built for every role</h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24, maxWidth: 1000, margin: '0 auto'
        }}>
          {[
            { role: 'Doctor', icon: '👨‍⚕️', features: ['View assigned patients', 'Add clinical notes', 'Access AI insights', 'Manage prescriptions'] },
            { role: 'Caregiver', icon: '👩‍🦳', features: ['Record daily observations', 'Track symptoms', 'Upload reports', 'Monitor patients'] },
            { role: 'Patient', icon: '🧓', features: ['View health records', 'Check medications', 'Read AI summaries', 'View timeline'] },
            { role: 'Admin', icon: '🛡️', features: ['Manage all users', 'Assign staff', 'View audit logs', 'System analytics'] },
          ].map((r, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '28px 20px',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>{r.role}</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {r.features.map((f, j) => (
                  <li key={j} style={{ fontSize: 13, opacity: 0.8, marginBottom: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#60a5fa', marginTop: 1 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 34, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
          Ready to transform healthcare delivery?
        </h2>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 36 }}>
          Join EvoCare and experience the future of AI-powered elderly care management.
        </p>
        <Link to="/register">
          <button style={{
            padding: '14px 40px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(59,130,246,0.35)'
          }}>
            🚀 Get Started Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0f172a', padding: '32px 60px',
        color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 13
      }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: '#60a5fa', fontWeight: 700 }}>EvoCare</span> — AI-Powered Elderly Healthcare Management Platform
        </div>
        <div>Built with Spring Boot 3 · React 18 · Google Gemini · PostgreSQL · JWT</div>
        <div style={{ marginTop: 8, opacity: 0.4 }}>© 2024 EvoCare. Built for Healthcare Innovation.</div>
      </footer>
    </div>
  );
};

export default LandingPage;
