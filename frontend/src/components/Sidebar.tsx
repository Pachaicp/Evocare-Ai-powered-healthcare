import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const doctorNav: NavItem[] = [
  { label: 'Dashboard', path: '/doctor', icon: '🏥' },
  { label: 'My Patients', path: '/doctor/patients', icon: '👥' },
  { label: 'Clinical Notes', path: '/doctor/notes', icon: '📝' },
  { label: 'AI Insights', path: '/doctor/ai-insights', icon: '🤖' },
  { label: 'Profile', path: '/doctor/profile', icon: '👤' },
];

const caregiverNav: NavItem[] = [
  { label: 'Dashboard', path: '/caregiver', icon: '🏠' },
  { label: 'Add Observation', path: '/caregiver/add-observation', icon: '➕' },
  { label: 'Observation History', path: '/caregiver/observations', icon: '📋' },
  { label: 'My Patients', path: '/caregiver/patients', icon: '👥' },
  { label: 'Profile', path: '/caregiver/profile', icon: '👤' },
];

const patientNav: NavItem[] = [
  { label: 'My Records', path: '/patient', icon: '📁' },
  { label: 'Medications', path: '/patient/medications', icon: '💊' },
  { label: 'Reports', path: '/patient/reports', icon: '📄' },
  { label: 'Timeline', path: '/patient/timeline', icon: '⏱️' },
  { label: 'AI Summary', path: '/patient/ai-summary', icon: '🤖' },
  { label: 'Profile', path: '/patient/profile', icon: '👤' },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: '📊' },
  { label: 'User Management', path: '/admin/users', icon: '👥' },
  { label: 'Patient Management', path: '/admin/patients', icon: '🏥' },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: '🔍' },
  { label: 'Profile', path: '/admin/profile', icon: '👤' },
];

const navMap: Record<string, NavItem[]> = {
  ROLE_DOCTOR: doctorNav,
  ROLE_CAREGIVER: caregiverNav,
  ROLE_PATIENT: patientNav,
  ROLE_ADMIN: adminNav,
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navItems = user ? (navMap[user.role] || []) : [];

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">🩺</div>
          <div>
            <h1>EvoCare</h1>
            <span>AI Healthcare Platform</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length === 2}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <p>{user?.name}</p>
            <span>{user?.role.replace('ROLE_', '')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
