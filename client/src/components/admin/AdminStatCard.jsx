import React from 'react';

const AdminStatCard = ({ title, value, icon: Icon, color = '#1b4332', bg = '#f4f9f6', subtitle }) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #e2e8e4',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
      }}
    >
      <div>
        <span style={{ fontSize: '0.85rem', color: '#5c6e63', fontWeight: 600, display: 'block' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b4332', marginTop: '0.2rem' }}>
          {value}
        </div>
        {subtitle && (
          <span style={{ fontSize: '0.75rem', color: '#8e9e94', marginTop: '0.2rem', display: 'block' }}>
            {subtitle}
          </span>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: bg,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color,
          }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default AdminStatCard;
