import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, Shield } from 'lucide-react';

const AdminHeader = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8e4',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1b4332',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
          className="admin-mobile-toggle"
        >
          <Menu size={22} />
        </button>
        <span style={{ fontSize: '0.9rem', color: '#5c6e63', fontWeight: 600 }}>
          Admin Workspace
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f4f9f6', padding: '0.4rem 0.85rem', borderRadius: '99px' }}>
          <Shield size={16} color="#52b788" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b4332' }}>
            {user ? (`${user.firstName || ''} ${user.lastName || ''}`).trim() || user.email : 'Administrator'}
          </span>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          style={{
            background: 'none',
            border: '1px solid #e2e8e4',
            borderRadius: '8px',
            padding: '0.4rem 0.75rem',
            cursor: 'pointer',
            color: '#e63946',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
