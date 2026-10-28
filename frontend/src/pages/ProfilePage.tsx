import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">👤 My Profile</div>
          <div className="page-subtitle">Your account information</div>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>
        <div className="card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 28
            }}>
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{user?.name}</div>
              <span className={`role-tag role-${user?.role}`}>{user?.role?.replace('ROLE_', '')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email Address', value: user?.email },
              { label: 'Role', value: user?.role?.replace('ROLE_', '') },
              { label: 'User ID', value: `#${user?.userId}` },
            ].map((field, i) => (
              <div key={i} style={{
                padding: '14px 16px', background: 'var(--gray-50)',
                borderRadius: 8, border: '1px solid var(--gray-200)'
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.8px', color: 'var(--gray-400)', marginBottom: 4 }}>
                  {field.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)' }}>{field.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
