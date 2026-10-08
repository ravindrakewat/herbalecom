import React from 'react';

const AdminStatusBadge = ({ status, type = 'order' }) => {
  const getColors = () => {
    const s = String(status || '').toUpperCase();

    if (s === 'CONFIRMED' || s === 'PAID' || s === 'DELIVERED' || s === 'APPROVED' || s === 'IN_STOCK' || s === 'ACTIVE' || status === true) {
      return { bg: '#d8f3dc', color: '#1b4332' };
    }
    if (s === 'PROCESSING' || s === 'SHIPPED' || s === 'LOW_STOCK' || s === 'PENDING') {
      return { bg: '#fff3cd', color: '#856404' };
    }
    if (s === 'CANCELLED' || s === 'FAILED' || s === 'REFUNDED' || s === 'OUT_OF_STOCK' || s === 'REJECTED' || s === 'INACTIVE' || status === false) {
      return { bg: '#fde8e8', color: '#9b1c1c' };
    }
    return { bg: '#e2e8e4', color: '#5c6e63' };
  };

  const { bg, color } = getColors();
  const label = typeof status === 'boolean' ? (status ? 'Active' : 'Inactive') : status;

  return (
    <span
      style={{
        backgroundColor: bg,
        color: color,
        padding: '0.2rem 0.65rem',
        borderRadius: '99px',
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'inline-block',
        textTransform: 'capitalize',
      }}
    >
      {label}
    </span>
  );
};

export default AdminStatusBadge;
