import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminPagination = ({ page = 1, totalPages = 1, onPageChange, total = 0 }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
      <span style={{ fontSize: '0.85rem', color: '#5c6e63' }}>
        Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total records)
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #c8d6ce',
            backgroundColor: page <= 1 ? '#f0f4f2' : '#ffffff',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.85rem',
          }}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #c8d6ce',
            backgroundColor: page >= totalPages ? '#f0f4f2' : '#ffffff',
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.85rem',
          }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
