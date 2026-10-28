import React from 'react';
import { useAuth } from '../context/AuthContext';

interface TopNavbarProps {
  title: string;
  subtitle?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ title, subtitle }) => {
  const { logout, user } = useAuth();

  return (
    <header className="top-navbar">
      <div>
        <div className="navbar-title">{title}</div>
        {subtitle && <div className="navbar-subtitle">{subtitle}</div>}
      </div>
      <div className="navbar-actions">
        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          👋 Welcome, {user?.name?.split(' ')[0]}
        </span>
        <button className="navbar-btn logout" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
