import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<'ROLE_DOCTOR' | 'ROLE_CAREGIVER' | 'ROLE_PATIENT' | 'ROLE_ADMIN'>('ROLE_DOCTOR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const roleRedirects: Record<string, string> = {
        ROLE_ADMIN: '/admin',
        ROLE_DOCTOR: '/doctor',
        ROLE_CAREGIVER: '/caregiver',
        ROLE_PATIENT: '/patient',
      };
      navigate(roleRedirects[user.role] || '/doctor');
    } catch (err: any) {
      // Demo Mode Fallback: Automatically accept any username/password entered!
      const formattedName = email.includes('@') ? email.split('@')[0] : email;
      const capitalizedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
      const demoUser = {
        accessToken: 'demo-access-token-xyz',
        refreshToken: 'demo-refresh-token-xyz',
        tokenType: 'Bearer',
        userId: 2,
        name: capitalizedName || 'Healthcare User',
        email: email.includes('@') ? email : `${email}@evocare.com`,
        role: selectedRole,
      };
      localStorage.setItem('accessToken', demoUser.accessToken);
      localStorage.setItem('refreshToken', demoUser.refreshToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      const redirects: Record<string, string> = {
        ROLE_ADMIN: '/admin',
        ROLE_DOCTOR: '/doctor',
        ROLE_CAREGIVER: '/caregiver',
        ROLE_PATIENT: '/patient',
      };
      window.location.href = redirects[selectedRole] || '/doctor';
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = async (role: string) => {
    setError('');
    setLoading(true);
    const creds: Record<string, { email: string; password: string; redirect: string }> = {
      admin: { email: 'admin@evocare.com', password: 'Admin@123', redirect: '/admin' },
      doctor: { email: 'doctor@evocare.com', password: 'Doctor@123', redirect: '/doctor' },
      caregiver: { email: 'caregiver@evocare.com', password: 'Care@123', redirect: '/caregiver' },
      patient: { email: 'patient@evocare.com', password: 'Patient@123', redirect: '/patient' },
    };
    const c = creds[role];
    setEmail(c.email);
    setPassword(c.password);
    try {
      await login(c.email, c.password);
      navigate(c.redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 54, height: 54, background: 'rgba(255,255,255,0.15)',
              borderRadius: 14, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 28
            }}>🩺</div>
            <span style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Plus Jakarta Sans' }}>EvoCare</span>
          </div>
          <h1 className="hero-tagline">
            AI-Powered<br />
            <span>Elderly Healthcare</span><br />
            Management
          </h1>
          <p style={{ marginTop: 16 }}>
            Connecting Doctors, Caregivers, Patients and Administrators in a unified, intelligent healthcare ecosystem.
          </p>
        </div>

        {/* Quick 1-Click Demo Login */}
        <div style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 20,
          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)'
        }}>
          <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            🚀 Instant 1-Click Demo Login:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { role: 'doctor', icon: '👨‍⚕️', label: 'Doctor Portal' },
              { role: 'caregiver', icon: '🧑‍🌾', label: 'Caregiver Portal' },
              { role: 'patient', icon: '👵', label: 'Patient Portal' },
              { role: 'admin', icon: '🛠️', label: 'Admin Portal' },
            ].map(item => (
              <button
                key={item.role}
                onClick={() => handleInstantDemo(item.role)}
                disabled={loading}
                style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, opacity: 0.4, marginTop: 32, fontStyle: 'italic' }}>
          "AI assists. Doctors decide."
        </p>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-logo">
            <div className="icon">🩺</div>
            <h2>EvoCare</h2>
          </div>

          <h3>Welcome back</h3>
          <p>Sign in to your healthcare account</p>

          <div style={{
            margin: '16px 0 20px', padding: 14, background: '#f0f4ff', borderRadius: 10,
            border: '1px solid #d0e0ff'
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚡ 1-Click Demo Quick Access
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <button type="button" onClick={() => handleInstantDemo('doctor')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                👨‍⚕️ Doctor Demo
              </button>
              <button type="button" onClick={() => handleInstantDemo('caregiver')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                🧑‍🌾 Caregiver Demo
              </button>
              <button type="button" onClick={() => handleInstantDemo('patient')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                👵 Patient Demo
              </button>
              <button type="button" onClick={() => handleInstantDemo('admin')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                🛠️ Admin Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter any username or email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter any password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Role</label>
              <select
                className="form-select"
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as any)}
              >
                <option value="ROLE_DOCTOR">👨‍⚕️ Doctor</option>
                <option value="ROLE_CAREGIVER">🧑‍🌾 Caregiver</option>
                <option value="ROLE_PATIENT">👵 Patient</option>
                <option value="ROLE_ADMIN">🛠️ Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? '⏳ Signing in...' : '🔑 Sign In'}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--gray-500)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create account</Link>
          </p>

          <p style={{ marginTop: 12, textAlign: 'center', fontSize: 14, color: 'var(--gray-500)' }}>
            <Link to="/" className="auth-link">← Back to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
